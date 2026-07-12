// api/admin.js — действия администратора. Защищено паролем ADMIN_PASSWORD.
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
  const { password, action } = req.body || {};
  if (!process.env.ADMIN_PASSWORD || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Неверный пароль" });
  }
  try {
    if (action === "list") {
      const flat = await redis(["HGETALL", "cifro:users"]);
      const users = [];
      if (Array.isArray(flat)) {
        for (let i = 0; i < flat.length; i += 2) {
          try { users.push({ id: flat[i], ...JSON.parse(flat[i + 1]) }); } catch (e) {}
        }
      }
      users.sort((a, b) => (b.ts || 0) - (a.ts || 0));
      const cfg = await redis(["GET", "cifro:config"]);
      return res.status(200).json({ users, config: cfg ? JSON.parse(cfg) : {} });
    }
    if (action === "setPaid") {
      const { id, paid, plan } = req.body;
      const ex = await redis(["HGET", "cifro:users", id]);
      if (!ex) return res.status(404).json({ error: "нет пользователя" });
      const o = JSON.parse(ex);
      o.paid = !!paid;
      if (plan !== undefined) o.plan = plan;
      await redis(["HSET", "cifro:users", id, JSON.stringify(o)]);
      return res.status(200).json({ ok: true });
    }
    if (action === "setConfig") {
      const { kaspiLink, kaspiSubLink, appleLink, price, subPrice, promo } = req.body;
      await redis(["SET", "cifro:config", JSON.stringify({
        kaspiLink: kaspiLink || "", kaspiSubLink: kaspiSubLink || "", appleLink: appleLink || "",
        price: price || "", subPrice: subPrice || "", promo: promo || "",
      })]);
      return res.status(200).json({ ok: true });
    }
    return res.status(400).json({ error: "unknown action" });
  } catch (e) {
    return res.status(500).json({ error: "Ошибка базы. Проверь, что подключён Redis (Upstash)." });
  }
}

