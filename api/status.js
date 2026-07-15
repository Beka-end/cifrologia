// api/status.js — оплатил ли пользователь (Turso)
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
];
export default async function handler(req,res){
  try{
    const id=String(req.query.id||"").trim().toLowerCase();
    if(!id) return res.status(200).json({paid:false});
    const r=await db([...ENSURE,{ sql:"SELECT data FROM users WHERE login=?", args:[id] }]);
    const rows=r[r.length-1];
    if(!rows.length) return res.status(200).json({paid:false});
    const o=JSON.parse(rows[0].data);
    return res.status(200).json({ paid:!!o.paid, plan:o.plan||null });
  }catch(e){ return res.status(200).json({paid:false}); }
}
