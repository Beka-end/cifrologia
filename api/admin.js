// api/admin.js — админка (Turso): список, онлайн, оплата, редактирование, удаление
async function db(statements){
  const url = process.env.TURSO_DATABASE_URL || process.env.TURSO_URL;
  const token = process.env.TURSO_AUTH_TOKEN || process.env.TURSO_TOKEN;
  if(!url || !token) throw new Error("no db");
  const base = url.replace(/^libsql:\/\//,"https://").replace(/\/+$/,"");
  const requests = statements.map(s=>({ type:"execute", stmt:{ sql:s.sql,
    args:(s.args||[]).map(a=> (a===null||a===undefined)?{type:"null"}:{type:"text",value:String(a)}) } }));
  requests.push({ type:"close" });
  const r = await fetch(base+"/v2/pipeline",{ method:"POST",
    headers:{ Authorization:`Bearer ${token}`, "Content-Type":"application/json" },
    body: JSON.stringify({ requests }) });
  const d = await r.json();
  return (d.results||[])
    .filter(x=> x && x.type==="ok" && x.response && x.response.type==="execute")
    .map(res=>{
      const result=res.response.result||{}; const cols=(result.cols||[]).map(c=>c.name);
      return (result.rows||[]).map(row=>{ const o={}; row.forEach((cell,i)=>{ o[cols[i]]=(cell&&cell.type==="null")?null:(cell?cell.value:null); }); return o; });
    });
}
const ENSURE = [
  { sql:"CREATE TABLE IF NOT EXISTS users (login TEXT PRIMARY KEY, data TEXT)" },
  { sql:"CREATE TABLE IF NOT EXISTS config (k TEXT PRIMARY KEY, v TEXT)" },
  { sql:"CREATE TABLE IF NOT EXISTS presence (login TEXT PRIMARY KEY, seen TEXT)" },
];
export default async function handler(req,res){
  if(req.method!=="POST") return res.status(405).json({error:"POST only"});
  const { password, action } = req.body||{};
  if(!process.env.ADMIN_PASSWORD || password!==process.env.ADMIN_PASSWORD) return res.status(401).json({error:"Неверный пароль"});
  try{
    if(action==="list"){
      const r=await db([...ENSURE,
        { sql:"SELECT login,data FROM users" },
        { sql:"SELECT v FROM config WHERE k=?", args:["cifro:config"] },
        { sql:"SELECT login,seen FROM presence" }]);
      const urows=r[r.length-3], crows=r[r.length-2], prows=r[r.length-1];
      const now=Date.now(), ONLINE=120000;
      const seenMap={}; for(const p of prows){ seenMap[p.login]=+p.seen||0; }
      const users=[];
      for(const row of urows){ try{ const o=JSON.parse(row.data);
        users.push({ id:row.login, ...o, online:(now-(seenMap[row.login]||0))<ONLINE, lastSeen:seenMap[row.login]||0 }); }catch(e){} }
      users.sort((a,b)=>(b.online?1:0)-(a.online?1:0) || (b.ts||0)-(a.ts||0));
      const config = crows.length ? JSON.parse(crows[0].v) : {};
      return res.status(200).json({ users, config, onlineCount: users.filter(u=>u.online).length });
    }
    if(action==="setPaid"){
      const { id, paid, plan } = req.body;
      const r=await db([...ENSURE,{ sql:"SELECT data FROM users WHERE login=?", args:[id] }]);
      const rows=r[r.length-1];
      if(!rows.length) return res.status(404).json({error:"нет пользователя"});
      const o=JSON.parse(rows[0].data); o.paid=!!paid; if(plan!==undefined)o.plan=plan;
      await db([{ sql:"UPDATE users SET data=? WHERE login=?", args:[JSON.stringify(o), id] }]);
      return res.status(200).json({ ok:true });
    }
    if(action==="setUser"){
      const { id, name, dob } = req.body;
      const r=await db([...ENSURE,{ sql:"SELECT data FROM users WHERE login=?", args:[id] }]);
      const rows=r[r.length-1];
      if(!rows.length) return res.status(404).json({error:"нет пользователя"});
      const o=JSON.parse(rows[0].data);
      if(name!==undefined && name!==null) o.name=name;
      if(dob!==undefined && dob!==null) o.dob=dob;
      await db([{ sql:"UPDATE users SET data=? WHERE login=?", args:[JSON.stringify(o), id] }]);
      return res.status(200).json({ ok:true });
    }
    if(action==="delUser"){
      await db([...ENSURE,
        { sql:"DELETE FROM users WHERE login=?", args:[req.body.id] },
        { sql:"DELETE FROM presence WHERE login=?", args:[req.body.id] }]);
      return res.status(200).json({ ok:true });
    }
    if(action==="setConfig"){
      const { kaspiLink, appleLink, price, promo, showHistory } = req.body;
      const v = JSON.stringify({ kaspiLink:kaspiLink||"", appleLink:appleLink||"", price:price||"", promo:promo||"", showHistory: showHistory!==false });
      await db([...ENSURE,{ sql:"INSERT OR REPLACE INTO config(k,v) VALUES(?,?)", args:["cifro:config", v] }]);
      return res.status(200).json({ ok:true });
    }
    return res.status(400).json({error:"unknown action"});
  }catch(e){ return res.status(500).json({error:"Ошибка базы. Проверь подключение Turso."}); }
}
