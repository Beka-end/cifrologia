// api/config.js — публичные настройки (ссылка Kaspi и цена), чтобы показать на кнопке оплаты
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
    const c = await redis(["GET", "cifro:config"]);
    const cfg = c ? JSON.parse(c) : {};
    const { promo, ...pub } = cfg; // секретный промокод наружу не отдаём
    return res.status(200).json(pub);
  } catch (e) {
    return res.status(200).json({});
  }
}
