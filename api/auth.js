// api/auth.js — вход и регистрация (Turso / SQLite)
import crypto from "crypto";
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
function hash(login,pass){ return crypto.createHash("sha256").update((process.env.AUTH_PEPPER||"cifro")+":"+login+":"+pass).digest("hex"); }

export default async function handler(req,res){
  if(req.method!=="POST") return res.status(405).json({error:"POST only"});
  const { action, login, password, name, dob } = req.body||{};
  const id = String(login||"").trim().toLowerCase();
  if(!/^[a-z0-9_]{3,20}$/.test(id)) return res.status(200).json({error:"bad_login"});
  try{
    if(action==="check"){
      const r=await db([...ENSURE,{ sql:"SELECT data FROM users WHERE login=?", args:[id] }]);
      return res.status(200).json({ exists: r[r.length-1].length>0 });
    }
    if(action==="register"){
      const r=await db([...ENSURE,{ sql:"SELECT data FROM users WHERE login=?", args:[id] }]);
      if(r[r.length-1].length>0) return res.status(200).json({ error:"exists" });
      if(!password || String(password).length<4) return res.status(200).json({ error:"weak" });
      const rec={ name:name||id, dob:dob||"", ts:Date.now(), paid:false, plan:null, pass:hash(id,password) };
      await db([{ sql:"INSERT INTO users(login,data) VALUES(?,?)", args:[id, JSON.stringify(rec)] }]);
      return res.status(200).json({ ok:true, profile:{ name:rec.name, dob:rec.dob }, paid:false });
    }
    if(action==="login"){
      const r=await db([...ENSURE,{ sql:"SELECT data FROM users WHERE login=?", args:[id] }]);
      const rows=r[r.length-1];
      if(!rows.length) return res.status(200).json({ error:"nouser" });
      const o=JSON.parse(rows[0].data);
      if(o.pass!==hash(id,password)) return res.status(200).json({ error:"badpass" });
      return res.status(200).json({ ok:true, profile:{ name:o.name, dob:o.dob }, paid:!!o.paid });
    }
    return res.status(400).json({ error:"unknown" });
  }catch(e){ return res.status(200).json({ error:"db" }); }
}
