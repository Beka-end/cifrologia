// api/redeem.js — проверяет секретный промокод и открывает пользователю полный доступ
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
    const { id, code } = req.body || {};
    if (!id || !code) return res.status(200).json({ ok: false });

    const cRaw = await redis(["GET", "cifro:config"]);
    const cfg = cRaw ? JSON.parse(cRaw) : {};

    if (cfg.promo && String(code).trim() === String(cfg.promo).trim()) {
      let rec = { name: "", dob: "", ts: Date.now(), paid: true, plan: "promo" };
      try {
        const ex = await redis(["HGET", "cifro:users", id]);
        if (ex) rec = { ...JSON.parse(ex), paid: true, plan: "promo" };
      } catch (e) {}
      await redis(["HSET", "cifro:users", id, JSON.stringify(rec)]);
      return res.status(200).json({ ok: true });
    }
    return res.status(200).json({ ok: false });
  } catch (e) {
    return res.status(200).json({ ok: false });
  }
}
