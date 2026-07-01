// api/oracle.js
// Серверная функция-посредник для Vercel.
// Ключ Anthropic хранится ТОЛЬКО здесь — в переменной окружения ANTHROPIC_API_KEY.
// Клиент (браузер) обращается к /api/oracle и никогда не видит ключ.

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Только POST" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res
      .status(500)
      .json({ error: "Не задан ANTHROPIC_API_KEY в переменных окружения Vercel" });
  }

  try {
    const {
      messages,
      system,
      max_tokens = 1000,
      model = "claude-sonnet-4-6", // можно сменить на "claude-haiku-4-5-20251001" ради экономии
    } = req.body || {};

    const upstream = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({ model, max_tokens, system, messages }),
    });

    const data = await upstream.json();
    return res.status(upstream.status).json(data);
  } catch (e) {
    return res.status(500).json({ error: "Ошибка обращения к ИИ" });
  }
}
