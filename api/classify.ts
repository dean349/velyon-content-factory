import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { prompt, apiKey } = req.body;
  if (!prompt || !apiKey) return res.status(400).json({ error: 'prompt and apiKey are required' });

  try {
    const apiRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-5',
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!apiRes.ok) {
      const err = await apiRes.text();
      return res.status(apiRes.status).json({ error: `Anthropic API error: ${err}` });
    }

    const data = await apiRes.json() as { content: { type: string; text: string }[] };
    let text = data.content[0].text.trim();
    text = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
    const parsed = JSON.parse(text);
    return res.status(200).json(parsed);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Classification failed' });
  }
}
