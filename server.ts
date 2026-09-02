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

  // AI Generate Sticker endpoint (Supports Text-to-Sticker & Image-to-Sticker Reference)
  app.post('/api/ai/generate-sticker', async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(400).json({ error: 'GEMINI_API_KEY is not configured.' });
      }

      const { prompt, style, shape, finish, borderThickness, referenceImage, aiEngine } = req.body;
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const STYLE_PROMPT_MAP: Record<string, string> = {
        'minimalist': 'minimalist flat graphic vector, clean solid contours, 3-4 flat color tones, zen modern graphic design',
        'pop-art': 'authentic 1960s pop-art comic book style, bold Ben-Day dots halftone screen, Roy Lichtenstein primary CMYK colors, heavy black ink outlines',
        'kawaii': 'authentic Japanese kawaii chibi anime character, soft sweet pastel tones, cute sparkling eyes with star glints, blushing rosy cheeks, joyful smiling sticker',
        'retro-vinyl': 'authentic 1970s vintage vinyl album sticker, warm sepia, mustard and burnt orange analog tones, vinyl record grooves, retro retro-badge',
        'cyberpunk': 'cyberpunk neon graphic, electric cyan (#00f0ff) and hot magenta glowing rim light, dark synth aesthetic, CRT scanline effects',
        'holographic': 'prismatic holographic foil decal, iridescent rainbow spectrum sheen, metallic specular highlights, radiant diffraction foil',
        'vaporwave': '1980s 1990s retro vaporwave aesthetic, sunset lilac and cyan split toning, synthwave grid reflections, nostalgic retro decal',
        '3d-render': '3D Pixar/Blender isometric toy render, smooth glossy clay plastic material, volumetric studio soft lighting, cute dimensional character',
        'ink-sketch': 'traditional Japanese sumi-e manga ink sketch, hand-drawn black ink pen strokes, intricate crosshatching shadows, organic drawing',
        'pixel-art': 'authentic 8-bit 16-bit retro arcade pixel art sprite, crisp square pixel grid, nostalgic video game palette, sharp arcade graphic',
        'watercolor': 'authentic wet-on-wet watercolor painting, translucent pigment pooling and bleeding at edges, delicate paper texture wash',
        'embroidery': 'authentic embroidered tactile fabric patch, raised thread stitch relief, textured woven yarn fibers, gold border stitching',
        'graffiti': 'urban street graffiti stencil, spray paint aerosol mist splatter, authentic dripping paint drops, heavy street marker contour',
        'origami': 'folded geometric origami paper art, crisp sharp low-poly facets, angular paper crease lighting and shadows',
        'clear-vinyl': 'crystal clear transparent vinyl sticker, glossy glass-like sheen, translucent edge refraction, ultra-clean decal'
      };

      const styleKey = style || 'pop-art';
      const styleDesc = STYLE_PROMPT_MAP[styleKey] || styleKey;
      const shapeDesc = shape || 'die-cut';
      const finishDesc = finish || 'glossy';
      const engineName = aiEngine || 'nano-banana-pro';
      const borderDesc = borderThickness === 0 ? 'no border' : borderThickness === 2 ? 'extra-thick 28px crisp white vinyl die-cut contour outline border' : 'thick clean crisp white vinyl die-cut contour outline border';

      const fullPrompt = `Vector die-cut sticker of ${prompt || 'an awesome character icon'}, in ${styleDesc}, ${finishDesc} material texture highlight sheen, with a ${borderDesc}, solid clean contour shape: ${shapeDesc}. Isolated subject on a completely pure solid white background, high contrast, crisp vector edges, vibrant sticker graphics. Negative constraints: no blurry elements, no realistic photographic noise, no messy borders, no cutoffs, high resolution sticker graphic art.`;

      let generatedImageUrl: string | null = null;

      try {
        // Model routing based on engine
        const modelTarget = engineName === 'gemini-3.7-pro' ? 'gemini-3.7-flash' : 'gemini-3.1-flash-lite-image';

        if (referenceImage && referenceImage.includes('base64,')) {
          const base64Data = referenceImage.split('base64,')[1];
          const mimeType = referenceImage.substring(referenceImage.indexOf(':') + 1, referenceImage.indexOf(';')) || 'image/png';
          
          const response = await ai.models.generateContent({
            model: modelTarget,
            contents: {
              parts: [
                {
                  inlineData: {
                    data: base64Data,
                    mimeType: mimeType,
                  },
                },
                {
                  text: `Transform this reference image into an authentic sticker: ${fullPrompt}`,
                },
              ],
            },
          });

          for (const candidate of response.candidates || []) {
            for (const part of candidate.content?.parts || []) {
              if (part.inlineData?.data) {
                generatedImageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
                break;
              }
            }
            if (generatedImageUrl) break;
          }
        } else {
          const response = await ai.models.generateContent({
            model: modelTarget,
            contents: {
              parts: [
                {
                  text: fullPrompt,
                },
              ],
            },
          });

          for (const candidate of response.candidates || []) {
            for (const part of candidate.content?.parts || []) {
              if (part.inlineData?.data) {
                generatedImageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
                break;
              }
            }
            if (generatedImageUrl) break;
          }
        }
      } catch (genErr: any) {
        console.warn(`Direct image model generation (${engineName}) returned:`, genErr?.message || genErr);
      }

      if (generatedImageUrl) {
        return res.json({ success: true, imageUrl: generatedImageUrl, prompt: fullPrompt });
      }

      // If image model is not available or requires paid key, generate detailed SVG/concept with standard Gemini 3.7 / 2.5
      const textResponse = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: `You are the lead visual generator for Hub Stickers Pro 2026.
Generate a valid standalone scalable SVG sticker graphic representing:
Subject: "${prompt || 'Awesome sticker icon'}"
Style: "${styleDesc}"
Shape: "${shapeDesc}"
Finish: "${finishDesc}"

Requirements:
- Clean SVG vector code with viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"
- Thick white die-cut contour stroke (stroke="#ffffff" stroke-width="24" stroke-linejoin="round" stroke-linecap="round")
- Beautiful rich gradient fills and shadows matching ${styleDesc} and ${finishDesc}
- Return ONLY valid raw SVG xml code starting with <svg> and ending with </svg>, without markdown backticks or explanations.`,
      });

      let svgCode = textResponse.text || '';
      if (svgCode.includes('```xml')) {
        svgCode = svgCode.replace(/```xml/g, '').replace(/```/g, '').trim();
      } else if (svgCode.includes('```svg')) {
        svgCode = svgCode.replace(/```svg/g, '').replace(/```/g, '').trim();
      } else if (svgCode.includes('```')) {
        svgCode = svgCode.replace(/```/g, '').trim();
      }

      if (svgCode.includes('<svg') && svgCode.includes('</svg>')) {
        const svgDataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svgCode)}`;
        return res.json({ success: true, imageUrl: svgDataUrl, prompt: fullPrompt, format: 'svg' });
      }

      res.status(500).json({ error: 'Could not render sticker with AI.' });
    } catch (err: any) {
      console.error('AI Generation route error:', err);
      res.status(500).json({ error: err.message || 'Error generating sticker' });
    }
  });

  // AI Prompt Expansion / Sticker Vision route
  app.post('/api/ai/describe-or-enhance', async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(400).json({ error: 'GEMINI_API_KEY is not configured.' });
      }

      const { prompt, style, shape } = req.body;
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: `You are an expert sticker designer for Hub Stickers Pro 2026. 
Create an ultra-detailed creative sticker concept based on this request:
Subject: "${prompt || 'Awesome sticker'}"
Style: "${style || 'pop-art'}"
Shape: "${shape || 'die-cut'}"

Provide a concise, vivid description of the sticker art, color palette, lighting highlights, and sticker die-cut white border details. Keep under 100 words in Spanish.`
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
