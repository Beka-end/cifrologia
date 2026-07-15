// api/redeem.js — секретный промокод (Turso)
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
  return (d.results||[]).map(res=>{
    if(!res||res.type!=="ok"||!res.response||res.response.type!=="execute") return [];
    const result=res.response.result||{}; const cols=(result.cols||[]).map(c=>c.name);
    return (result.rows||[]).map(row=>{ const o={}; row.forEach((cell,i)=>{ o[cols[i]]=(cell&&cell.type==="null")?null:(cell?cell.value:null); }); return o; });
  });
}
const ENSURE = [
  { sql:"CREATE TABLE IF NOT EXISTS users (login TEXT PRIMARY KEY, data TEXT)" },
  { sql:"CREATE TABLE IF NOT EXISTS config (k TEXT PRIMARY KEY, v TEXT)" },
];
export default async function handler(req,res){
  if(req.method!=="POST") return res.status(405).json({error:"POST only"});
  try{
    const login=String((req.body&&req.body.id)||"").trim().toLowerCase();
    const code=req.body&&req.body.code;
    if(!login||!code) return res.status(200).json({ok:false});
    const r=await db([...ENSURE,
      { sql:"SELECT v FROM config WHERE k=?", args:["cifro:config"] },
      { sql:"SELECT data FROM users WHERE login=?", args:[login] }]);
    const crows=r[r.length-2], urows=r[r.length-1];
    const cfg = crows.length ? JSON.parse(crows[0].v) : {};
    if(cfg.promo && String(code).trim()===String(cfg.promo).trim()){
      let rec = urows.length ? JSON.parse(urows[0].data) : { name:login, dob:"", ts:Date.now(), paid:false, plan:null };
      rec.paid=true; rec.plan="promo";
      if(urows.length) await db([{ sql:"UPDATE users SET data=? WHERE login=?", args:[JSON.stringify(rec), login] }]);
      else await db([{ sql:"INSERT INTO users(login,data) VALUES(?,?)", args:[login, JSON.stringify(rec)] }]);
      return res.status(200).json({ ok:true });
    }
    return res.status(200).json({ ok:false });
  }catch(e){ return res.status(200).json({ ok:false }); }
}
