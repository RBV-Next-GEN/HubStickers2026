// Background removal service with transformer support and robust client-side fallback

let segmenterPromise: Promise<any> | null = null;

export async function getSegmenter(onProgress?: (progress: number) => void) {
  if (!segmenterPromise) {
    segmenterPromise = (async () => {
      try {
        const { pipeline, env } = await import('@huggingface/transformers');
        env.allowLocalModels = false;
        env.useBrowserCache = true;
        
        // Try webgpu first, then cpu
        try {
          return await pipeline('image-segmentation', 'Xenova/modnet', {
            device: 'webgpu',
            progress_callback: (p: any) => {
              if (p?.progress && onProgress) onProgress(Math.round(p.progress * 100));
            },
          });
        } catch {
          return await pipeline('image-segmentation', 'Xenova/modnet', {
            progress_callback: (p: any) => {
              if (p?.progress && onProgress) onProgress(Math.round(p.progress * 100));
            },
          });
        }
      } catch (err) {
        console.warn('Transformers pipeline not available or failed to load, using smart canvas fallback:', err);
        return null;
      }
    })();
  }
  return segmenterPromise;
}

export async function removeBackground(dataUrl: string, onProgress?: (p: number) => void): Promise<string> {
  try {
    const segmenter = await getSegmenter(onProgress);
    if (segmenter) {
      const { RawImage } = await import('@huggingface/transformers');
      const image = await RawImage.fromURL(dataUrl);
      const output = await segmenter(image);
      const mask = output[0].mask;
      const canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;
      const ctx = canvas.getContext('2d')!;
      const originalCanvas = await image.toCanvas();
      ctx.drawImage(originalCanvas, 0, 0);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const maskResized = await mask.resize(image.width, image.height);
      for (let i = 0; i < imgData.data.length / 4; i++) {
        imgData.data[i * 4 + 3] = maskResized.data[i];
      }
      ctx.putImageData(imgData, 0, 0);
      return canvas.toDataURL('image/png');
    }
  } catch (err) {
    console.warn('Huggingface segmentation failed, falling back to smart edge/color extraction:', err);
  }

  // Smart Canvas cutout fallback (Corner flood-fill + contrast alpha extraction)
  return fallbackSmartCutout(dataUrl, onProgress);
}

function fallbackSmartCutout(dataUrl: string, onProgress?: (p: number) => void): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      onProgress?.(30);
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);
      
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;
      const w = canvas.width;
      const h = canvas.height;

      // Sample 4 corner colors to detect background tint
      const corners = [
        [0, 0],
        [w - 1, 0],
        [0, h - 1],
        [w - 1, h - 1],
      ];
      
      let bgR = 0, bgG = 0, bgB = 0;
      for (const [cx, cy] of corners) {
        const idx = (cy * w + cx) * 4;
        bgR += data[idx];
        bgG += data[idx + 1];
        bgB += data[idx + 2];
      }
      bgR = Math.round(bgR / corners.length);
      bgG = Math.round(bgG / corners.length);
      bgB = Math.round(bgB / corners.length);

      // Remove pixels close to background color or with high white/light luminosity
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];
        if (a === 0) continue;

        // Euclidean color distance to sampled bg
        const dist = Math.sqrt((r - bgR) ** 2 + (g - bgG) ** 2 + (b - bgB) ** 2);
        
        // If near white / light bg or matches corner background
        const isLight = (r > 240 && g > 240 && b > 240);
        const isNearBg = dist < 35;

        if (isNearBg || (isLight && dist < 50)) {
          data[i + 3] = 0;
        } else if (dist < 60) {
          // Feather edges
          data[i + 3] = Math.round(((dist - 35) / 25) * a);
        }
      }

      onProgress?.(80);
      ctx.putImageData(imgData, 0, 0);
      onProgress?.(100);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
}
