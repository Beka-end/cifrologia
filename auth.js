// api/auth.js — вход и регистрация по логину (латиница) + пароль
import crypto from "crypto";

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
function hash(login, pass) {
  return crypto.createHash("sha256").update((process.env.AUTH_PEPPER || "cifro") + ":" + login + ":" + pass).digest("hex");
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
  const { action, login, password, name, dob } = req.body || {};
  const id = String(login || "").trim().toLowerCase();
  if (!/^[a-z0-9_]{3,20}$/.test(id)) return res.status(200).json({ error: "bad_login" });

  try {
    if (action === "check") {
      const ex = await redis(["HGET", "cifro:users", id]);
      return res.status(200).json({ exists: !!ex });
    }
    if (action === "register") {
      const ex = await redis(["HGET", "cifro:users", id]);
      if (ex) return res.status(200).json({ error: "exists" });
      if (!password || String(password).length < 4) return res.status(200).json({ error: "weak" });
      const rec = { name: name || id, dob: dob || "", ts: Date.now(), paid: false, plan: null, pass: hash(id, password) };
      await redis(["HSET", "cifro:users", id, JSON.stringify(rec)]);
      return res.status(200).json({ ok: true, profile: { name: rec.name, dob: rec.dob }, paid: false });
    }
    if (action === "login") {
      const ex = await redis(["HGET", "cifro:users", id]);
      if (!ex) return res.status(200).json({ error: "nouser" });
      const o = JSON.parse(ex);
      if (o.pass !== hash(id, password)) return res.status(200).json({ error: "badpass" });
      return res.status(200).json({ ok: true, profile: { name: o.name, dob: o.dob }, paid: !!o.paid });
    }
    return res.status(400).json({ error: "unknown" });
  } catch (e) {
    // база не подключена — фронтенд перейдёт в гостевой режим
    return res.status(200).json({ error: "db" });
  }
}
