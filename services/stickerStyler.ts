import { StickerSettings, StickerStyle, StickerShape, StickerFinish, StickerPalette } from '../types';

export const STYLES_INFO: Record<StickerStyle, { label: string; desc: string; icon: string; color: string }> = {
  'minimalist': { label: 'Minimalista', desc: 'Líneas limpias, colores planos, diseño zen', icon: 'crop_square', color: '#94a3b8' },
  'pop-art': { label: 'Pop Art', desc: 'Colores vibrantes, semitono halftone, estilo cómic', icon: 'palette', color: '#f43f5e' },
  'kawaii': { label: 'Kawaii', desc: 'Tierno, ojos brillantes, sonrisas, tonos pastel', icon: 'favorite', color: '#f472b6' },
  'retro-vinyl': { label: 'Vinilo Retro', desc: 'Estilo años 70/80 con textura vintage', icon: 'album', color: '#f59e0b' },
  'cyberpunk': { label: 'Cyberpunk', desc: 'Neón futurista, brillo cian y magenta', icon: 'bolt', color: '#06b6d4' },
  'holographic': { label: 'Holográfico', desc: 'Reflejos irisados y destellos prismáticos', icon: 'auto_awesome', color: '#a855f7' },
  'vaporwave': { label: 'Vaporwave', desc: 'Estética 90s, degradados lila/azul y rejillas', icon: 'waves', color: '#ec4899' },
  '3d-render': { label: 'Render 3D', desc: 'Volumen realista, sombras suaves, aspecto juguete', icon: 'view_in_ar', color: '#3b82f6' },
  'ink-sketch': { label: 'Boceto Tinta', desc: 'Trazos en blanco y negro, tramas manuales', icon: 'draw', color: '#71717a' },
  'pixel-art': { label: 'Pixel Art', desc: 'Retro 8-bit / 16-bit arcade pixelado', icon: 'grid_on', color: '#10b981' },
  'watercolor': { label: 'Acuarela', desc: 'Manchas translúcidas y bordes difuminados', icon: 'brush', color: '#14b8a6' },
  'embroidery': { label: 'Bordado', desc: 'Puntadas de hilo texturizadas y relieve', icon: 'texture', color: '#d97706' },
  'graffiti': { label: 'Graffiti', desc: 'Bordes gruesos de spray, goteos y arte urbano', icon: 'format_paint', color: '#ef4444' },
  'origami': { label: 'Origami', desc: 'Pliegues geométricos de papel y facetas', icon: 'change_history', color: '#8b5cf6' },
  'clear-vinyl': { label: 'Vinilo Transparente', desc: 'Pegatina translúcida sin borde blanco opaco', icon: 'opacity', color: '#64748b' }
};

export const SHAPES_INFO: Record<StickerShape, { label: string; icon: string }> = {
  'die-cut': { label: 'Troquelado (Die-Cut)', icon: 'content_cut' },
  'circle': { label: 'Circular', icon: 'radio_button_unchecked' },
  'square': { label: 'Cuadrado', icon: 'square' },
  'badge': { label: 'Placa / Emblema', icon: 'verified' },
  'heart': { label: 'Corazón', icon: 'favorite' },
  'hexagon': { label: 'Hexágono', icon: 'hexagon' }
};

export const FINISH_INFO: Record<StickerFinish, { label: string; icon: string; desc: string }> = {
  'glossy': { label: 'Brillante (Glossy)', icon: 'light_mode', desc: 'Reflejo de luz curvo' },
  'matte': { label: 'Mate (Matte)', icon: 'hdr_strong', desc: 'Suave sin reflejos' },
  'glitter': { label: 'Purpurina (Glitter)', icon: 'sparkles', desc: 'Microdestellos dorados y plateados' },
  'holographic-foil': { label: 'Foil Holográfico', icon: 'auto_awesome', desc: 'Brillo arcoíris prismático' },
  'metallic': { label: 'Metálico', icon: 'workspace_premium', desc: 'Efecto lámina oro / plata' }
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

        // Clear canvas
        ctx.clearRect(0, 0, targetSize, targetSize);

        // Padding for border and peel drop shadow
        const padding = targetSize * 0.12;
        const contentWidth = targetSize - padding * 2;
        const contentHeight = targetSize - padding * 2;

        // Calculate aspect ratio
        let drawW = contentWidth;
        let drawH = contentHeight;
        if (img.width > img.height) {
          drawH = (img.height / img.width) * contentWidth;
        } else {
          drawW = (img.width / img.height) * contentHeight;
        }

        const drawX = padding + (contentWidth - drawW) / 2;
        const drawY = padding + (contentHeight - drawH) / 2;

        // Offscreen canvas for processed image content
        const offCanvas = document.createElement('canvas');
        offCanvas.width = targetSize;
        offCanvas.height = targetSize;
        const offCtx = offCanvas.getContext('2d', { willReadFrequently: true })!;

        // Apply Shape Mask if not die-cut
        if (settings.shape !== 'die-cut') {
          offCtx.save();
          applyShapeClip(offCtx, settings.shape, padding, padding, contentWidth, contentHeight);
          
          // Background fill if requested
          if (settings.backgroundColor === 'white') {
            offCtx.fillStyle = '#ffffff';
            offCtx.fillRect(0, 0, targetSize, targetSize);
          } else if (settings.backgroundColor === 'none') {
            // transparent
          }
          
          offCtx.drawImage(img, drawX, drawY, drawW, drawH);
          offCtx.restore();
        } else {
          offCtx.drawImage(img, drawX, drawY, drawW, drawH);
        }

        // Apply Style Filters (e.g. Pop Art, Cyberpunk, Pixel Art, Kawaii, etc.)
        applyStyleFilter(offCtx, settings.style, targetSize, targetSize, settings.palette);

        // Add Caption Text if present
        if (settings.captionText && settings.captionText.trim().length > 0) {
          drawStickerCaption(offCtx, settings.captionText.trim(), targetSize);
        }

        // Now draw Sticker Border and Shadow onto main canvas
        const borderThicknessPx = settings.style === 'clear-vinyl' ? 0 : 
          settings.borderThickness === 0 ? 0 : settings.borderThickness === 1 ? 16 : 28;

        if (borderThicknessPx > 0) {
          drawWhiteStickerOutline(ctx, offCanvas, borderThicknessPx, targetSize);
        }

        // Draw the styled sticker content
        ctx.drawImage(offCanvas, 0, 0);

        // Apply Finish (Glossy, Holographic, Glitter, Metallic, Matte)
        applyStickerFinish(ctx, settings.finish, targetSize, targetSize);

        resolve(canvas.toDataURL('image/png'));
      } catch (e) {
        reject(e);
      }
    };
    img.onerror = reject;
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
  const cx = x + w / 2;
  const cy = y + h / 2;
  const r = Math.min(w, h) / 2;

  ctx.beginPath();
  switch (shape) {
    case 'circle':
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      break;
    case 'square': {
      const radius = 32;
      ctx.roundRect(x, y, w, h, radius);
      break;
    }
    case 'badge': {
      const points = 12;
      const innerR = r * 0.82;
      for (let i = 0; i < points * 2; i++) {
        const radius = i % 2 === 0 ? r : innerR;
        const angle = (i * Math.PI) / points - Math.PI / 2;
        const px = cx + Math.cos(angle) * radius;
        const py = cy + Math.sin(angle) * radius;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      break;
    }
    case 'heart': {
      const topCurveH = h * 0.3;
      ctx.moveTo(cx, y + topCurveH);
      ctx.bezierCurveTo(cx, y, x, y, x, y + topCurveH);
      ctx.bezierCurveTo(x, y + (h + topCurveH) / 2, cx, y + (h + topCurveH) / 2, cx, y + h);
      ctx.bezierCurveTo(cx, y + (h + topCurveH) / 2, x + w, y + (h + topCurveH) / 2, x + w, y + topCurveH);
      ctx.bezierCurveTo(x + w, y, cx, y, cx, y + topCurveH);
      break;
    }
    case 'hexagon': {
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3 - Math.PI / 6;
        const px = cx + Math.cos(angle) * r;
        const py = cy + Math.sin(angle) * r;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      break;
    }
    default:
      ctx.rect(x, y, w, h);
  }
  ctx.clip();
}

function applyStyleFilter(
  ctx: CanvasRenderingContext2D,
  style: StickerStyle,
  width: number,
  height: number,
  palette: StickerPalette
) {
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  // Style-specific adjustments
  if (style === 'pop-art') {
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] < 10) continue;
      // High contrast comic quantization
      data[i] = data[i] > 128 ? 255 : 0;
      data[i + 1] = data[i + 1] > 128 ? 240 : 20;
      data[i + 2] = data[i + 2] > 128 ? 255 : 40;
    }
    ctx.putImageData(imgData, 0, 0);
  } else if (style === 'kawaii') {
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] < 10) continue;
      // Boost pink/warm pastel tones & brightness
      data[i] = Math.min(255, data[i] * 1.15 + 25);
      data[i + 1] = Math.min(255, data[i + 1] * 1.05 + 15);
      data[i + 2] = Math.min(255, data[i + 2] * 1.1 + 20);
    }
    ctx.putImageData(imgData, 0, 0);
  } else if (style === 'cyberpunk') {
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] < 10) continue;
      // Magenta / Cyan shift
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      if (avg > 128) {
        data[i] = Math.min(255, data[i] + 60);
        data[i + 1] = Math.min(255, data[i + 1] + 20);
        data[i + 2] = 255;
      } else {
        data[i] = 255;
        data[i + 1] = 0;
        data[i + 2] = 180;
      }
    }
    ctx.putImageData(imgData, 0, 0);
  } else if (style === 'ink-sketch' || palette === 'noir') {
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] < 10) continue;
      const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      const val = gray > 140 ? 255 : gray > 80 ? 90 : 20;
      data[i] = val;
      data[i + 1] = val;
      data[i + 2] = val;
    }
    ctx.putImageData(imgData, 0, 0);
  } else if (style === 'pixel-art') {
    // Pixelate
    const pixelSize = 8;
    for (let y = 0; y < height; y += pixelSize) {
      for (let x = 0; x < width; x += pixelSize) {
        const i = (y * width + x) * 4;
        if (data[i + 3] < 10) continue;
        const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
        for (let py = 0; py < pixelSize && y + py < height; py++) {
          for (let px = 0; px < pixelSize && x + px < width; px++) {
            const pi = ((y + py) * width + (x + px)) * 4;
            if (data[pi + 3] > 10) {
              data[pi] = r;
              data[pi + 1] = g;
              data[pi + 2] = b;
              data[pi + 3] = a;
            }
          }
        }
      }
    }
    ctx.putImageData(imgData, 0, 0);
  }
}

function drawStickerCaption(ctx: CanvasRenderingContext2D, text: string, targetSize: number) {
  ctx.save();
  const fontSize = Math.round(targetSize * 0.055);
  ctx.font = `900 ${fontSize}px "Space Grotesk", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const x = targetSize / 2;
  const y = targetSize * 0.85;

  // Text background banner pill
  const metrics = ctx.measureText(text.toUpperCase());
  const bannerW = metrics.width + 40;
  const bannerH = fontSize + 20;

  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.roundRect(x - bannerW / 2, y - bannerH / 2, bannerW, bannerH, 16);
  ctx.fill();

  ctx.lineWidth = 4;
  ctx.strokeStyle = '#ffffff';
  ctx.stroke();

  // Text
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
  // Use drop shadow passes & radius dilation to create smooth, solid die-cut white vinyl border
  destCtx.save();
  destCtx.shadowColor = 'rgba(0, 0, 0, 0.35)';
  destCtx.shadowBlur = 18;
  destCtx.shadowOffsetY = 12;

  // Render white halo by sampling multiple angles
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
  // Fill inner
  for (let r = 2; r < radius; r += 3) {
    for (let i = 0; i < 16; i++) {
      const angle = (i * 2 * Math.PI) / 16;
      outCtx.drawImage(sourceCanvas, Math.cos(angle) * r, Math.sin(angle) * r);
    }
  }

  // Tint outline pure white
  outCtx.globalCompositeOperation = 'source-in';
  outCtx.fillStyle = '#ffffff';
  outCtx.fillRect(0, 0, targetSize, targetSize);

  // Draw shadow + white outline to destination
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
    // Curved glass highlight
    const grad = ctx.createLinearGradient(0, 0, width, height * 0.7);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
    grad.addColorStop(0.3, 'rgba(255, 255, 255, 0.15)');
    grad.addColorStop(0.5, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(width * 0.45, height * 0.25, width * 0.4, height * 0.22, -0.35, 0, Math.PI * 2);
    ctx.fill();
  } else if (finish === 'holographic-foil') {
    // Rainbow foil gradient overlay
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
    // Sparkle speckles
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    const seed = 120;
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
    grad.addColorStop(0, 'rgba(255, 215, 0, 0.3)');
    grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.4)');
    grad.addColorStop(1, 'rgba(218, 165, 32, 0.3)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
  }

  ctx.restore();
}
