// api/status.js — приложение спрашивает: оплатил ли этот пользователь?
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
  try {
    const id = req.query.id;
    if (!id) return res.status(200).json({ paid: false });
    const ex = await redis(["HGET", "cifro:users", id]);
    if (!ex) return res.status(200).json({ paid: false });
    const o = JSON.parse(ex);
    return res.status(200).json({ paid: !!o.paid, plan: o.plan || null });
  } catch (e) {
    return res.status(200).json({ paid: false });
  }
}
