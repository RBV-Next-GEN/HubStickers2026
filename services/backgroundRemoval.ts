import { pipeline, env, RawImage } from '@huggingface/transformers';

env.allowLocalModels = false;
env.useBrowserCache = false;

let segmenterPromise: Promise<any> | null = null;

export async function getSegmenter(onProgress?: (progress: number) => void) {
  if (!segmenterPromise) {
    segmenterPromise = pipeline('image-segmentation', 'Xenova/modnet', {
      device: 'webgpu', 
      progress_callback: (p: any) => {
        if (p.progress && onProgress) onProgress(p.progress);
      },
    });
  }
  return segmenterPromise;
}

export async function removeBackground(dataUrl: string, onProgress?: (p: number) => void): Promise<string> {
  const segmenter = await getSegmenter(onProgress);
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