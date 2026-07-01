// api/register.js — записывает посетителя в базу (кто зарегался)
async function redis(cmd) {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) throw new Error("no db");
  const r = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "content-type": "application/json" },
    body: JSON.stringify(cmd),
  });
  return (await r.json()).result;
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
  try {
    const { id, name, dob } = req.body || {};
    if (!id) return res.status(400).json({ error: "no id" });
    // сохраняем статус оплаты, если пользователь уже был
    let paid = false, plan = null;
    try {
      const ex = await redis(["HGET", "cifro:users", id]);
      if (ex) { const o = JSON.parse(ex); paid = !!o.paid; plan = o.plan || null; }
    } catch (e) {}
    const rec = JSON.stringify({ name: name || "", dob: dob || "", ts: Date.now(), paid, plan });
    await redis(["HSET", "cifro:users", id, rec]);
    return res.status(200).json({ ok: true });
  } catch (e) {
    // без базы просто ничего не пишем — приложение продолжает работать
    return res.status(200).json({ ok: false });
  }
}
