import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
      timestamp: new Date().toISOString()
    });
  });

  // AI Prompt Expansion / Sticker Vision route
  app.post('/api/ai/describe-or-enhance', async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(400).json({ error: 'GEMINI_API_KEY is not configured.' });
      }

      const { prompt, style, shape } = req.body;
      const ai = new GoogleGenAI({ apiKey });

      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: `You are an expert sticker designer for Hub Stickers Pro. 
Create an ultra-detailed creative sticker concept based on this request:
Subject: "${prompt || 'Awesome sticker'}"
Style: "${style || 'pop-art'}"
Shape: "${shape || 'die-cut'}"

Provide a concise, vivid description of the sticker art, color palette, lighting highlights, and sticker die-cut white border details. Keep under 100 words in Spanish and English.`
      });

      res.json({
        success: true,
        text: response.text
      });
    } catch (err: any) {
      console.error('Gemini API error:', err);
      res.status(500).json({ error: err.message || 'Error communicating with Gemini' });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Hub Stickers Pro 2026] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
