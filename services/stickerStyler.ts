import { StickerSettings, StickerStyle, StickerShape, StickerFinish, StickerPalette, AiEngine } from '../types';

export const AI_ENGINES_INFO: Record<AiEngine, { label: string; desc: string; icon: string; badge: string }> = {
  'nano-banana-pro': {
    label: 'Nano Banana Pro',
    desc: 'Motor de Inteligencia Generativa 2026 (Máxima Calidad y Fidelidad)',
    icon: '🍌',
    badge: 'PRO DEFAULT'
  },
  'nano-banana-turbo': {
    label: 'Nano Banana Turbo',
    desc: 'Motor de Generación Rápida de Baja Latencia',
    icon: '⚡',
    badge: 'TURBO'
  },
  'gemini-3.7-pro': {
    label: 'Gemini 3.7 Pro Sticker',
    desc: 'Modelo Multimodal Avanzado con Troquelado Vectorial HD',
    icon: '✨',
    badge: 'VECTOR HD'
  },
  'flow-vector': {
    label: 'Flow Vector Engine',
    desc: 'Renderizado de Trazos y Curvas Bézier de Precisión',
    icon: '🎨',
    badge: 'FLOW STUDIO'
  },
  'modnet-local': {
    label: 'Transformers.js ModNet',
    desc: 'Segmentación Neuronal Local en GPU/WebAssembly',
    icon: '🪄',
    badge: 'LOCAL ON-DEVICE'
  }
};

export const STYLES_INFO: Record<StickerStyle, { label: string; desc: string; color: string }> = {
  'minimalist': { label: 'Minimalista', desc: 'Líneas limpias, colores planos, diseño zen', color: '#94a3b8' },
  'pop-art': { label: 'Pop Art', desc: 'Colores vibrantes, semitono halftone, estilo cómic', color: '#f43f5e' },
  'kawaii': { label: 'Kawaii', desc: 'Tierno, ojos brillantes, sonrisas, tonos pastel', color: '#f472b6' },
  'retro-vinyl': { label: 'Vinilo Retro', desc: 'Estilo años 70/80 con textura vintage', color: '#f59e0b' },
  'cyberpunk': { label: 'Cyberpunk', desc: 'Neón futurista, brillo cian y magenta', color: '#06b6d4' },
  'holographic': { label: 'Holográfico', desc: 'Reflejos irisados y destellos prismáticos', color: '#a855f7' },
  'vaporwave': { label: 'Vaporwave', desc: 'Estética 90s, degradados lila/azul y rejillas', color: '#ec4899' },
  '3d-render': { label: 'Render 3D', desc: 'Volumen realista, sombras suaves, aspecto juguete', color: '#3b82f6' },
  'ink-sketch': { label: 'Boceto Tinta', desc: 'Trazos en blanco y negro, tramas manuales', color: '#71717a' },
  'pixel-art': { label: 'Pixel Art', desc: 'Retro 8-bit / 16-bit arcade pixelado', color: '#10b981' },
  'watercolor': { label: 'Acuarela', desc: 'Manchas translúcidas y bordes difuminados', color: '#14b8a6' },
  'embroidery': { label: 'Bordado', desc: 'Puntadas de hilo texturizadas y relieve', color: '#d97706' },
  'graffiti': { label: 'Graffiti', desc: 'Bordes gruesos de spray, goteos y arte urbano', color: '#ef4444' },
  'origami': { label: 'Origami', desc: 'Pliegues geométricos de papel y facetas', color: '#8b5cf6' },
  'clear-vinyl': { label: 'Vinilo Transparente', desc: 'Pegatina translúcida sin borde blanco opaco', color: '#64748b' }
};

export const SHAPES_INFO: Record<StickerShape, { label: string; desc: string }> = {
  'die-cut': { label: 'Troquelado (Die-Cut)', desc: 'Silueta exacta alrededor del sujeto' },
  'circle': { label: 'Circular', desc: 'Placa redonda perfecta' },
  'square': { label: 'Cuadrado', desc: 'Esquinas suaves redondeadas' },
  'badge': { label: 'Emblema / Badge', desc: 'Escudo oficial de alta calidad' },
  'heart': { label: 'Corazón', desc: 'Silueta de corazón romántica' },
  'hexagon': { label: 'Hexágono', desc: 'Forma geométrica moderna' }
};

export const FINISH_INFO: Record<StickerFinish, { label: string; desc: string; sampleGradient: string }> = {
  'glossy': { 
    label: 'Brillante (Glossy)', 
    desc: 'Reflejo de luz curvo pulido', 
    sampleGradient: 'linear-gradient(135deg, #60a5fa, #3b82f6)' 
  },
  'matte': { 
    label: 'Mate (Matte)', 
    desc: 'Suave al tacto y sin reflejos', 
    sampleGradient: 'linear-gradient(135deg, #64748b, #475569)' 
  },
  'glitter': { 
    label: 'Purpurina (Glitter)', 
    desc: 'Destellos dorados y plateados', 
    sampleGradient: 'linear-gradient(135deg, #f59e0b, #ec4899)' 
  },
  'holographic-foil': { 
    label: 'Foil Holográfico', 
    desc: 'Brillo arcoíris prismático', 
    sampleGradient: 'linear-gradient(135deg, #ec4899, #06b6d4, #eab308)' 
  },
  'metallic': { 
    label: 'Metálico', 
    desc: 'Efecto lámina oro / plata', 
    sampleGradient: 'linear-gradient(135deg, #eab308, #ca8a04, #713f12)' 
  }
};

export const PALETTES_INFO: Record<StickerPalette, { label: string; colors: string[] }> = {
  'default': { label: 'Original', colors: ['#ffffff', '#3b82f6', '#ef4444', '#10b981'] },
  'vibrant': { label: 'Vibrante', colors: ['#ff007f', '#00f0ff', '#ffe600', '#7928ca'] },
  'pastel': { label: 'Pastel Dulce', colors: ['#fbcfe8', '#bae6fd', '#fef08a', '#bbf7d0'] },
  'neon': { label: 'Neón Eléctrico', colors: ['#39ff14', '#ff073a', '#04d9ff', '#fe019a'] },
  'vintage': { label: 'Vintage Cálido', colors: ['#e07a5f', '#3d405b', '#81b29a', '#f2cc8f'] },
  'noir': { label: 'Blanco y Negro', colors: ['#18181b', '#52525b', '#a1a1aa', '#ffffff'] },
  'earthy': { label: 'Tierra Natural', colors: ['#606c38', '#283618', '#dda15e', '#bc6c25'] }
};

// Generates canvas rendered sticker with cutouts, shapes, white border outline, finishes, caption
export async function renderStickerCanvas(
  imageUrl: string,
  settings: StickerSettings,
  targetSize: number = 1000
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = targetSize;
        canvas.height = targetSize;
        const ctx = canvas.getContext('2d', { willReadFrequently: true })!;

        ctx.clearRect(0, 0, targetSize, targetSize);

        const padding = targetSize * 0.12;
        const contentWidth = targetSize - padding * 2;
        const contentHeight = targetSize - padding * 2;

        let drawW = contentWidth;
        let drawH = contentHeight;
        if (img.width > img.height) {
          drawH = (img.height / img.width) * contentWidth;
        } else {
          drawW = (img.width / img.height) * contentHeight;
        }

        const drawX = padding + (contentWidth - drawW) / 2;
        const drawY = padding + (contentHeight - drawH) / 2;

        const offCanvas = document.createElement('canvas');
        offCanvas.width = targetSize;
        offCanvas.height = targetSize;
        const offCtx = offCanvas.getContext('2d', { willReadFrequently: true })!;

        if (settings.shape !== 'die-cut') {
          offCtx.save();
          applyShapeClip(offCtx, settings.shape, padding, padding, contentWidth, contentHeight);

          if (settings.backgroundColor === 'white') {
            offCtx.fillStyle = '#ffffff';
            offCtx.fillRect(0, 0, targetSize, targetSize);
          }

          offCtx.drawImage(img, drawX, drawY, drawW, drawH);
          applyAuthenticStyleFilter(offCtx, settings.style, targetSize, targetSize, settings.palette, drawX, drawY, drawW, drawH);
          offCtx.restore();
        } else {
          offCtx.drawImage(img, drawX, drawY, drawW, drawH);
          applyAuthenticStyleFilter(offCtx, settings.style, targetSize, targetSize, settings.palette, drawX, drawY, drawW, drawH);
        }

        if (settings.captionText.trim()) {
          drawStickerCaption(offCtx, settings.captionText.trim(), targetSize);
        }

        if (settings.style !== 'clear-vinyl' && settings.borderThickness > 0) {
          const borderPx = settings.borderThickness === 1 ? Math.round(targetSize * 0.018) : Math.round(targetSize * 0.034);
          drawWhiteStickerOutline(ctx, offCanvas, borderPx, targetSize);
        }

        ctx.drawImage(offCanvas, 0, 0);
        applyStickerFinish(ctx, settings.finish, targetSize, targetSize);

        resolve(canvas.toDataURL('image/png'));
      } catch (err) {
        reject(err);
      }
    };
    img.onerror = () => reject(new Error('No se pudo cargar la imagen para renderizar'));
    img.src = imageUrl;
  });
}

function applyShapeClip(
  ctx: CanvasRenderingContext2D,
  shape: StickerShape,
  x: number,
  y: number,
  w: number,
  h: number
) {
  ctx.beginPath();
  const cx = x + w / 2;
  const cy = y + h / 2;
  const r = Math.min(w, h) / 2;

  if (shape === 'circle') {
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
  } else if (shape === 'square') {
    const corner = Math.round(r * 0.25);
    ctx.roundRect(x, y, w, h, corner);
  } else if (shape === 'badge') {
    const points = 12;
    const outerR = r;
    const innerR = r * 0.85;
    for (let i = 0; i < points * 2; i++) {
      const radius = i % 2 === 0 ? outerR : innerR;
      const angle = (i * Math.PI) / points;
      const px = cx + Math.cos(angle) * radius;
      const py = cy + Math.sin(angle) * radius;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
  } else if (shape === 'heart') {
    const topCurveHeight = h * 0.3;
    ctx.moveTo(cx, cy + h * 0.45);
    ctx.bezierCurveTo(x, cy + h * 0.1, x, y, cx - w * 0.25, y);
    ctx.bezierCurveTo(cx, y, cx, cy - topCurveHeight * 0.3, cx, cy - topCurveHeight * 0.3);
    ctx.bezierCurveTo(cx, cy - topCurveHeight * 0.3, cx, y, cx + w * 0.25, y);
    ctx.bezierCurveTo(x + w, y, x + w, cy + h * 0.1, cx, cy + h * 0.45);
    ctx.closePath();
  } else if (shape === 'hexagon') {
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      const px = cx + Math.cos(angle) * r;
      const py = cy + Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
  }
  ctx.clip();
}

/**
 * Authentic Artistic Style Filter Engine
 * Accurately transforms the graphic according to genuine artistic conventions for each of the 15 styles.
 */
function applyAuthenticStyleFilter(
  ctx: CanvasRenderingContext2D,
  style: StickerStyle,
  width: number,
  height: number,
  palette: StickerPalette,
  drawX: number,
  drawY: number,
  drawW: number,
  drawH: number
) {
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  // 1. POP ART (Roy Lichtenstein / Andy Warhol Comic Halftone)
  if (style === 'pop-art') {
    // Quantize to vibrant primary comic colors
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] < 15) continue;
      const r = data[i], g = data[i + 1], b = data[i + 2];
      const brightness = (r + g + b) / 3;
      
      if (brightness > 210) {
        data[i] = 255; data[i + 1] = 255; data[i + 2] = 255; // Crisp White
      } else if (brightness > 140) {
        if (r > g && r > b) {
          data[i] = 255; data[i + 1] = 40; data[i + 2] = 60; // Comic Red
        } else if (g > r && g > b) {
          data[i] = 40; data[i + 1] = 220; data[i + 2] = 70; // Comic Green
        } else {
          data[i] = 255; data[i + 1] = 220; data[i + 2] = 0; // Comic Yellow
        }
      } else if (brightness > 70) {
        data[i] = 0; data[i + 1] = 140; data[i + 2] = 255; // Comic Cyan/Blue
      } else {
        data[i] = 20; data[i + 1] = 20; data[i + 2] = 25; // Bold Ink Black
      }
    }
    ctx.putImageData(imgData, 0, 0);

    // Overlay authentic Ben-Day dots halftone pattern
    ctx.save();
    ctx.globalCompositeOperation = 'source-atop';
    const dotSpacing = 8;
    for (let y = drawY; y < drawY + drawH; y += dotSpacing) {
      for (let x = drawX; x < drawX + drawW; x += dotSpacing) {
        const idx = (Math.floor(y) * width + Math.floor(x)) * 4;
        if (data[idx + 3] > 30) {
          ctx.fillStyle = 'rgba(255, 0, 80, 0.22)';
          ctx.beginPath();
          ctx.arc(x, y, 1.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
    // Comic heavy contour ink accent
    ctx.strokeStyle = '#111827';
    ctx.lineWidth = 3;
    ctx.strokeRect(drawX + 4, drawY + 4, drawW - 8, drawH - 8);
    ctx.restore();
    return;
  }

  // 2. KAWAII (Anime Cute / Sweet Blush / Sparkles)
  if (style === 'kawaii') {
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] < 15) continue;
      // Soft candy pastel color enhancement
      data[i] = Math.min(255, data[i] * 1.1 + 35);
      data[i + 1] = Math.min(255, data[i + 1] * 1.05 + 28);
      data[i + 2] = Math.min(255, data[i + 2] * 1.15 + 40);
    }
    ctx.putImageData(imgData, 0, 0);

    // Add cute rosy cheek ovals & sparkling anime star glints
    ctx.save();
    ctx.globalCompositeOperation = 'source-atop';
    
    // Rosy cheek spots
    const cheekY = drawY + drawH * 0.58;
    const cheekLeftX = drawX + drawW * 0.32;
    const cheekRightX = drawX + drawW * 0.68;
    ctx.fillStyle = 'rgba(255, 105, 180, 0.45)';
    ctx.beginPath();
    ctx.ellipse(cheekLeftX, cheekY, drawW * 0.08, drawH * 0.045, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(cheekRightX, cheekY, drawW * 0.08, drawH * 0.045, 0, 0, Math.PI * 2);
    ctx.fill();

    // Kawaii anime white star glints
    const glints = [
      { x: drawX + drawW * 0.28, y: drawY + drawH * 0.28, r: 8 },
      { x: drawX + drawW * 0.72, y: drawY + drawH * 0.24, r: 10 },
      { x: drawX + drawW * 0.48, y: drawY + drawH * 0.18, r: 6 }
    ];
    ctx.fillStyle = '#ffffff';
    glints.forEach(g => {
      ctx.beginPath();
      ctx.arc(g.x, g.y, g.r, 0, Math.PI * 2);
      ctx.fill();
      // Star rays
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(g.x - g.r * 2, g.y); ctx.lineTo(g.x + g.r * 2, g.y);
      ctx.moveTo(g.x, g.y - g.r * 2); ctx.lineTo(g.x, g.y + g.r * 2);
      ctx.stroke();
    });
    ctx.restore();
    return;
  }

  // 3. RETRO VINYL (1970s Warm Analog / Record Grooves / Vintage Tint)
  if (style === 'retro-vinyl') {
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] < 15) continue;
      const r = data[i], g = data[i + 1], b = data[i + 2];
      // Warm 70s orange/sepia tint
      data[i] = Math.min(255, r * 1.15 + 30);
      data[i + 1] = Math.min(255, g * 0.95 + 15);
      data[i + 2] = Math.max(0, b * 0.7 - 10);
    }
    ctx.putImageData(imgData, 0, 0);

    // Subtle concentric vinyl grooves
    ctx.save();
    ctx.globalCompositeOperation = 'source-atop';
    const cx = drawX + drawW / 2;
    const cy = drawY + drawH / 2;
    ctx.strokeStyle = 'rgba(40, 20, 10, 0.15)';
    ctx.lineWidth = 1.2;
    for (let r = 20; r < Math.max(drawW, drawH); r += 9) {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
    }
    // Vintage warm edge vignette
    const vig = ctx.createRadialGradient(cx, cy, drawW * 0.2, cx, cy, drawW * 0.6);
    vig.addColorStop(0, 'rgba(245, 158, 11, 0)');
    vig.addColorStop(1, 'rgba(120, 53, 15, 0.35)');
    ctx.fillStyle = vig;
    ctx.fillRect(drawX, drawY, drawW, drawH);
    ctx.restore();
    return;
  }

  // 4. CYBERPUNK (Neon Glow / Chromatic Aberration / Cyan & Magenta CRT Scanlines)
  if (style === 'cyberpunk') {
    const copyData = new Uint8ClampedArray(data);
    const shift = 6; // Horizontal RGB displacement
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4;
        if (data[i + 3] < 15) continue;

        // Chromatic split
        const redIdx = (y * width + Math.min(width - 1, x + shift)) * 4;
        const blueIdx = (y * width + Math.max(0, x - shift)) * 4;
        
        data[i] = Math.min(255, copyData[redIdx] * 1.3 + 50); // Neon Magenta/Red
        data[i + 1] = Math.min(255, copyData[i + 1] * 0.7);
        data[i + 2] = Math.min(255, copyData[blueIdx] * 1.4 + 70); // Electric Cyan
      }
    }
    ctx.putImageData(imgData, 0, 0);

    // CRT horizontal scanlines
    ctx.save();
    ctx.globalCompositeOperation = 'source-atop';
    ctx.fillStyle = 'rgba(0, 240, 255, 0.12)';
    for (let y = drawY; y < drawY + drawH; y += 4) {
      ctx.fillRect(drawX, y, drawW, 1.5);
    }
    // Neon electric rim lighting
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(drawX + 6, drawY + 6, drawW - 12, drawH - 12);
    ctx.restore();
    return;
  }

  // 5. HOLOGRAPHIC (Prismatic Rainbow Reflection / Spectral Gradient Mapping)
  if (style === 'holographic') {
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] < 15) continue;
      const luma = (data[i] * 0.3 + data[i + 1] * 0.59 + data[i + 2] * 0.11) / 255;
      // Spectral rainbow angle shift
      const r = Math.sin(luma * Math.PI * 2) * 127 + 128;
      const g = Math.sin(luma * Math.PI * 2 + (2 * Math.PI / 3)) * 127 + 128;
      const b = Math.sin(luma * Math.PI * 2 + (4 * Math.PI / 3)) * 127 + 128;
      data[i] = (data[i] + r * 2) / 3;
      data[i + 1] = (data[i + 1] + g * 2) / 3;
      data[i + 2] = (data[i + 2] + b * 2) / 3;
    }
    ctx.putImageData(imgData, 0, 0);

    // Diagonal iridescent light beams
    ctx.save();
    ctx.globalCompositeOperation = 'source-atop';
    const grad = ctx.createLinearGradient(drawX, drawY, drawX + drawW, drawY + drawH);
    grad.addColorStop(0, 'rgba(255, 0, 128, 0.35)');
    grad.addColorStop(0.25, 'rgba(0, 240, 255, 0.35)');
    grad.addColorStop(0.5, 'rgba(255, 240, 0, 0.35)');
    grad.addColorStop(0.75, 'rgba(0, 255, 128, 0.35)');
    grad.addColorStop(1, 'rgba(180, 0, 255, 0.35)');
    ctx.fillStyle = grad;
    ctx.fillRect(drawX, drawY, drawW, drawH);
    ctx.restore();
    return;
  }

  // 6. VAPORWAVE (80s Synthwave Sunset / Magenta-Cyan Split Toning)
  if (style === 'vaporwave') {
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] < 15) continue;
      const luma = (data[i] + data[i + 1] + data[i + 2]) / 3;
      if (luma > 128) {
        data[i] = 255; data[i + 1] = 100; data[i + 2] = 200; // Neon Pink
      } else {
        data[i] = 40; data[i + 1] = 20; data[i + 2] = 110; // Deep Indigo
      }
    }
    ctx.putImageData(imgData, 0, 0);

    // Synthwave horizon grid lines
    ctx.save();
    ctx.globalCompositeOperation = 'source-atop';
    const horizon = drawY + drawH * 0.65;
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
    ctx.lineWidth = 1.5;
    for (let y = horizon; y < drawY + drawH; y += (y - horizon) * 0.45 + 5) {
      ctx.beginPath();
      ctx.moveTo(drawX, y); ctx.lineTo(drawX + drawW, y);
      ctx.stroke();
    }
    ctx.restore();
    return;
  }

  // 7. 3D RENDER (Blender / Pixar Toy Volume / Bevel Shadow & Gloss)
  if (style === '3d-render') {
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] < 15) continue;
      // High-saturation smooth clay boost
      data[i] = Math.min(255, data[i] * 1.15);
      data[i + 1] = Math.min(255, data[i + 1] * 1.15);
      data[i + 2] = Math.min(255, data[i + 2] * 1.15);
    }
    ctx.putImageData(imgData, 0, 0);

    ctx.save();
    ctx.globalCompositeOperation = 'source-atop';
    // Top-left volumetric highlight (3D sphere/clay reflection)
    const hlGrad = ctx.createRadialGradient(drawX + drawW * 0.35, drawY + drawH * 0.3, 10, drawX + drawW * 0.35, drawY + drawH * 0.3, drawW * 0.45);
    hlGrad.addColorStop(0, 'rgba(255, 255, 255, 0.65)');
    hlGrad.addColorStop(0.4, 'rgba(255, 255, 255, 0.15)');
    hlGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = hlGrad;
    ctx.fillRect(drawX, drawY, drawW, drawH);

    // Bottom-right ambient occlusion contact shadow
    const shGrad = ctx.createLinearGradient(drawX, drawY, drawX + drawW, drawY + drawH);
    shGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
    shGrad.addColorStop(0.7, 'rgba(0, 0, 0, 0.15)');
    shGrad.addColorStop(1, 'rgba(15, 23, 42, 0.45)');
    ctx.fillStyle = shGrad;
    ctx.fillRect(drawX, drawY, drawW, drawH);
    ctx.restore();
    return;
  }

  // 8. INK SKETCH (Manga / Sumi-e Hand-Drawn Cross-Hatching)
  if (style === 'ink-sketch' || palette === 'noir') {
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] < 15) continue;
      const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      const val = gray > 180 ? 255 : gray > 110 ? 190 : gray > 55 ? 80 : 15;
      data[i] = val; data[i + 1] = val; data[i + 2] = val;
    }
    ctx.putImageData(imgData, 0, 0);

    // Authentic pen hatchings on shadow regions
    ctx.save();
    ctx.globalCompositeOperation = 'source-atop';
    ctx.strokeStyle = '#18181b';
    ctx.lineWidth = 1.2;
    for (let y = drawY; y < drawY + drawH; y += 7) {
      for (let x = drawX; x < drawX + drawW; x += 7) {
        const idx = (Math.floor(y) * width + Math.floor(x)) * 4;
        if (data[idx + 3] > 30 && data[idx] < 140) {
          ctx.beginPath();
          ctx.moveTo(x - 3, y - 3); ctx.lineTo(x + 3, y + 3);
          if (data[idx] < 70) {
            ctx.moveTo(x + 3, y - 3); ctx.lineTo(x - 3, y + 3); // Crosshatch
          }
          ctx.stroke();
        }
      }
    }
    ctx.restore();
    return;
  }

  // 9. PIXEL ART (Authentic 8-Bit / 16-Bit Retro Arcade Grid)
  if (style === 'pixel-art') {
    const pixelSize = 9;
    for (let y = 0; y < height; y += pixelSize) {
      for (let x = 0; x < width; x += pixelSize) {
        const i = (y * width + x) * 4;
        if (data[i + 3] < 15) continue;
        // Quantize colors to retro 16-color palette steps
        const r = Math.round(data[i] / 64) * 64;
        const g = Math.round(data[i + 1] / 64) * 64;
        const b = Math.round(data[i + 2] / 64) * 64;
        const a = data[i + 3];

        for (let py = 0; py < pixelSize && y + py < height; py++) {
          for (let px = 0; px < pixelSize && x + px < width; px++) {
            const pi = ((y + py) * width + (x + px)) * 4;
            if (data[pi + 3] > 15) {
              data[pi] = r; data[pi + 1] = g; data[pi + 2] = b; data[pi + 3] = a;
            }
          }
        }
      }
    }
    ctx.putImageData(imgData, 0, 0);

    // Crisp pixel grid line overlay
    ctx.save();
    ctx.globalCompositeOperation = 'source-atop';
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.lineWidth = 0.8;
    for (let x = drawX; x < drawX + drawW; x += pixelSize) {
      ctx.beginPath(); ctx.moveTo(x, drawY); ctx.lineTo(x, drawY + drawH); ctx.stroke();
    }
    for (let y = drawY; y < drawY + drawH; y += pixelSize) {
      ctx.beginPath(); ctx.moveTo(drawX, y); ctx.lineTo(drawX + drawW, y); ctx.stroke();
    }
    ctx.restore();
    return;
  }

  // 10. WATERCOLOR (Wet Pigment Bleed & Paper Grain)
  if (style === 'watercolor') {
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] < 15) continue;
      // Soft translucent pigment bleeding
      data[i] = Math.min(255, data[i] * 1.05 + 18);
      data[i + 1] = Math.min(255, data[i + 1] * 1.05 + 18);
      data[i + 2] = Math.min(255, data[i + 2] * 1.05 + 24);
    }
    ctx.putImageData(imgData, 0, 0);

    // Rough paper texture overlay & dark bleeding edges
    ctx.save();
    ctx.globalCompositeOperation = 'source-atop';
    const paperGrad = ctx.createRadialGradient(drawX + drawW / 2, drawY + drawH / 2, drawW * 0.1, drawX + drawW / 2, drawY + drawH / 2, drawW * 0.55);
    paperGrad.addColorStop(0, 'rgba(255, 255, 255, 0.15)');
    paperGrad.addColorStop(0.8, 'rgba(20, 184, 166, 0.18)');
    paperGrad.addColorStop(1, 'rgba(15, 118, 110, 0.35)');
    ctx.fillStyle = paperGrad;
    ctx.fillRect(drawX, drawY, drawW, drawH);
    ctx.restore();
    return;
  }

  // 11. EMBROIDERY (Woven Thread Patch / Stitched Relief Seam)
  if (style === 'embroidery') {
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] < 15) continue;
      // Vibrant textile thread saturation
      data[i] = Math.min(255, data[i] * 1.2);
      data[i + 1] = Math.min(255, data[i + 1] * 1.2);
      data[i + 2] = Math.min(255, data[i + 2] * 1.2);
    }
    ctx.putImageData(imgData, 0, 0);

    // Textured stitched thread lines
    ctx.save();
    ctx.globalCompositeOperation = 'source-atop';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 1.2;
    for (let y = drawY; y < drawY + drawH; y += 4) {
      ctx.beginPath();
      ctx.moveTo(drawX, y);
      ctx.lineTo(drawX + drawW, y + 2);
      ctx.stroke();
    }
    // Gold/White embroidered perimeter border stitch
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3;
    ctx.setLineDash([6, 4]);
    ctx.strokeRect(drawX + 8, drawY + 8, drawW - 16, drawH - 16);
    ctx.restore();
    return;
  }

  // 12. GRAFFITI (Street Spray Paint / Stencil Splatter & Drips)
  if (style === 'graffiti') {
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] < 15) continue;
      // High-contrast urban spray paint saturation
      data[i] = data[i] > 100 ? 255 : 30;
      data[i + 1] = data[i + 1] > 120 ? Math.min(255, data[i + 1] * 1.3) : 20;
      data[i + 2] = data[i + 2] > 100 ? 255 : 40;
    }
    ctx.putImageData(imgData, 0, 0);

    // Spray paint splatter & dripping drops
    ctx.save();
    ctx.globalCompositeOperation = 'source-atop';
    ctx.fillStyle = '#ef4444';
    // Drops
    const drips = [
      { x: drawX + drawW * 0.25, y: drawY + drawH * 0.82, len: 24, w: 5 },
      { x: drawX + drawW * 0.52, y: drawY + drawH * 0.85, len: 32, w: 6 },
      { x: drawX + drawW * 0.78, y: drawY + drawH * 0.8, len: 20, w: 4 },
    ];
    drips.forEach(d => {
      ctx.beginPath();
      ctx.roundRect(d.x - d.w / 2, d.y, d.w, d.len, d.w);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(d.x, d.y + d.len + 3, d.w * 0.9, 0, Math.PI * 2);
      ctx.fill();
    });

    // Splatter spray dots
    ctx.fillStyle = 'rgba(239, 68, 68, 0.45)';
    for (let i = 0; i < 40; i++) {
      const sx = drawX + Math.random() * drawW;
      const sy = drawY + Math.random() * drawH;
      ctx.beginPath();
      ctx.arc(sx, sy, Math.random() * 2.5 + 0.8, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
    return;
  }

  // 13. ORIGAMI (Low-Poly Geometric Paper Facets & Crisp Creases)
  if (style === 'origami') {
    const polySize = 18;
    for (let y = 0; y < height; y += polySize) {
      for (let x = 0; x < width; x += polySize) {
        const i = (y * width + x) * 4;
        if (data[i + 3] < 15) continue;
        // Faceted light and shadow variation
        const facetLuma = ((x + y) / polySize) % 2 === 0 ? 1.25 : 0.8;
        const r = Math.min(255, data[i] * facetLuma);
        const g = Math.min(255, data[i + 1] * facetLuma);
        const b = Math.min(255, data[i + 2] * facetLuma);
        const a = data[i + 3];

        for (let py = 0; py < polySize && y + py < height; py++) {
          for (let px = 0; px < polySize && x + px < width; px++) {
            const pi = ((y + py) * width + (x + px)) * 4;
            if (data[pi + 3] > 15) {
              data[pi] = r; data[pi + 1] = g; data[pi + 2] = b; data[pi + 3] = a;
            }
          }
        }
      }
    }
    ctx.putImageData(imgData, 0, 0);

    // Diagonal origami paper crease lines
    ctx.save();
    ctx.globalCompositeOperation = 'source-atop';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 1.5;
    for (let x = drawX; x < drawX + drawW; x += polySize * 2) {
      ctx.beginPath();
      ctx.moveTo(x, drawY);
      ctx.lineTo(x + drawH, drawY + drawH);
      ctx.stroke();
    }
    ctx.restore();
    return;
  }

  // 14. MINIMALIST (Flat Vector Quantization / Zen Outline)
  if (style === 'minimalist') {
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] < 15) continue;
      // Quantize to 4 clean flat shades
      data[i] = Math.round(data[i] / 64) * 64;
      data[i + 1] = Math.round(data[i + 1] / 64) * 64;
      data[i + 2] = Math.round(data[i + 2] / 64) * 64;
    }
    ctx.putImageData(imgData, 0, 0);

    // Crisp fine vector outline
    ctx.save();
    ctx.globalCompositeOperation = 'source-atop';
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.strokeRect(drawX + 4, drawY + 4, drawW - 8, drawH - 8);
    ctx.restore();
    return;
  }

  // 15. CLEAR VINYL (Transparent Glass Sheen / Translucent Backing)
  if (style === 'clear-vinyl') {
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] < 15) continue;
      // Glossy transparent sheen
      data[i + 3] = Math.min(255, Math.round(data[i + 3] * 0.9));
    }
    ctx.putImageData(imgData, 0, 0);

    // Translucent glass highlight sheen
    ctx.save();
    ctx.globalCompositeOperation = 'source-atop';
    const glassGrad = ctx.createLinearGradient(drawX, drawY, drawX + drawW * 0.8, drawY + drawH * 0.8);
    glassGrad.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
    glassGrad.addColorStop(0.2, 'rgba(255, 255, 255, 0.1)');
    glassGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = glassGrad;
    ctx.fillRect(drawX, drawY, drawW, drawH);
    ctx.restore();
    return;
  }
}

function drawStickerCaption(ctx: CanvasRenderingContext2D, text: string, targetSize: number) {
  ctx.save();
  const fontSize = Math.round(targetSize * 0.052);
  ctx.font = `900 ${fontSize}px "Plus Jakarta Sans", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const x = targetSize / 2;
  const y = targetSize * 0.86;

  const metrics = ctx.measureText(text.toUpperCase());
  const bannerW = metrics.width + 36;
  const bannerH = fontSize + 18;

  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.roundRect(x - bannerW / 2, y - bannerH / 2, bannerW, bannerH, 14);
  ctx.fill();

  ctx.lineWidth = 3.5;
  ctx.strokeStyle = '#ffffff';
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.fillText(text.toUpperCase(), x, y);
  ctx.restore();
}

function drawWhiteStickerOutline(
  destCtx: CanvasRenderingContext2D,
  sourceCanvas: HTMLCanvasElement,
  borderSize: number,
  targetSize: number
) {
  destCtx.save();
  destCtx.shadowColor = 'rgba(0, 0, 0, 0.35)';
  destCtx.shadowBlur = 18;
  destCtx.shadowOffsetY = 12;

  const steps = 36;
  const radius = borderSize;

  const outlineCanvas = document.createElement('canvas');
  outlineCanvas.width = targetSize;
  outlineCanvas.height = targetSize;
  const outCtx = outlineCanvas.getContext('2d')!;

  for (let i = 0; i < steps; i++) {
    const angle = (i * 2 * Math.PI) / steps;
    const ox = Math.cos(angle) * radius;
    const oy = Math.sin(angle) * radius;
    outCtx.drawImage(sourceCanvas, ox, oy);
  }
  for (let r = 2; r < radius; r += 3) {
    for (let i = 0; i < 16; i++) {
      const angle = (i * 2 * Math.PI) / 16;
      outCtx.drawImage(sourceCanvas, Math.cos(angle) * r, Math.sin(angle) * r);
    }
  }

  outCtx.globalCompositeOperation = 'source-in';
  outCtx.fillStyle = '#ffffff';
  outCtx.fillRect(0, 0, targetSize, targetSize);

  destCtx.drawImage(outlineCanvas, 0, 0);
  destCtx.restore();
}

function applyStickerFinish(
  ctx: CanvasRenderingContext2D,
  finish: StickerFinish,
  width: number,
  height: number
) {
  ctx.save();
  ctx.globalCompositeOperation = 'source-atop';

  if (finish === 'glossy') {
    const grad = ctx.createLinearGradient(0, 0, width, height * 0.7);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
    grad.addColorStop(0.3, 'rgba(255, 255, 255, 0.15)');
    grad.addColorStop(0.5, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(width * 0.45, height * 0.25, width * 0.4, height * 0.22, -0.35, 0, Math.PI * 2);
    ctx.fill();
  } else if (finish === 'holographic-foil') {
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, 'rgba(255, 0, 128, 0.25)');
    grad.addColorStop(0.2, 'rgba(255, 165, 0, 0.2)');
    grad.addColorStop(0.4, 'rgba(255, 255, 0, 0.25)');
    grad.addColorStop(0.6, 'rgba(0, 255, 128, 0.2)');
    grad.addColorStop(0.8, 'rgba(0, 200, 255, 0.25)');
    grad.addColorStop(1, 'rgba(180, 0, 255, 0.2)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
  } else if (finish === 'glitter') {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    const seed = 140;
    for (let i = 0; i < seed; i++) {
      const sx = (Math.sin(i * 99) * 0.5 + 0.5) * width;
      const sy = (Math.cos(i * 33) * 0.5 + 0.5) * height;
      const sz = (i % 3) + 1.5;
      ctx.beginPath();
      ctx.arc(sx, sy, sz, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (finish === 'metallic') {
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, 'rgba(255, 215, 0, 0.35)');
    grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.45)');
    grad.addColorStop(1, 'rgba(218, 165, 32, 0.35)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
  }

  ctx.restore();
}

