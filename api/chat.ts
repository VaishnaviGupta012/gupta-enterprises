import { handleGeminiChat } from '../server/geminiHandler';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const { message, history } = body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid "message" in request body' });
    }

    const result = await handleGeminiChat(message, history || []);
    return res.status(200).json(result);
  } catch (err: any) {
    console.error('[API Chat Serverless Error]:', err);
    return res.status(500).json({
      success: false,
      fallback: true,
      error: err?.message || 'Internal Server Error',
    });
  }
}
