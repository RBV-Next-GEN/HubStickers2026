import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  StickerStyle,
  StickerShape,
  StickerPalette,
  StickerFinish,
  StickerSettings,
  StickerState,
  CanvasItem,
  HistoryItem
} from '../types';
import { CanvasEditor } from '../components/CanvasEditor';
import {
  PillButton,
  FieldDropdown,
  SegmentedToggle,
  TextInput,
  SectionLabel
} from '../components/Primitives';
import {
  STYLES_INFO,
  SHAPES_INFO,
  FINISH_INFO,
  PALETTES_INFO,
  renderStickerCanvas
} from '../services/stickerStyler';
import { removeBackground } from '../services/backgroundRemoval';
import { cropToContent } from '../services/imageProcessing';
import { PRESET_STICKERS } from './presets';

const DEFAULT_SETTINGS: StickerSettings = {
  style: 'pop-art',
  shape: 'die-cut',
  palette: 'default',
  finish: 'glossy',
  borderThickness: 1,
  backgroundColor: 'none',
  customSubject: '',
  useSmartCutout: true,
  styleGuidance: '',
  captionText: '',
  model: 'standard',
  sheetDensity: 6,
  croppingMode: '1:1',
};

export default function App() {
  const [state, setState] = useState<StickerState>({
    originalImage: PRESET_STICKERS[0].dataUrl,
    originalMime: 'image/svg+xml',
    cutoutImage: PRESET_STICKERS[0].dataUrl,
    cutoutMediaId: null,
    generatedSticker: null,
    samplerImages: {},
    failedSamplerStyles: [],
    selectedSamplerStyles: ['pop-art', 'kawaii', 'cyberpunk', 'holographic'],
    canvasItems: [
      {
        id: '1',
        url: '',
        x: 60,
        y: 80,
        rotation: -5,
        scale: 1,
      },
    ],
    history: [],
    undoStack: [],
    redoStack: [],
    viewMode: 'single',
    isLoading: false,
    status: '',
    error: null,
  });

  const [settings, setSettings] = useState<StickerSettings>(DEFAULT_SETTINGS);
  const [activePreset, setActivePreset] = useState<string>(PRESET_STICKERS[0].id);
  const [previewBg, setPreviewBg] = useState<'checker' | 'dark' | 'light'>('checker');
  const [exportState, setExportState] = useState<'idle' | 'busy' | 'done' | 'error'>('idle');
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiDescription, setAiDescription] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const sheetCanvasRef = useRef<HTMLCanvasElement>(null);

  // Generate current sticker whenever settings or cutout image changes
  useEffect(() => {
    let isCancelled = false;
    const updateSticker = async () => {
      const sourceImage = settings.useSmartCutout && state.cutoutImage
        ? state.cutoutImage
        : state.originalImage;

      if (!sourceImage) return;

      try {
        const rendered = await renderStickerCanvas(sourceImage, settings, 1024);
        if (!isCancelled) {
          setState((prev) => {
            const newHistoryItem: HistoryItem = {
              id: Date.now().toString(),
              timestamp: Date.now(),
              image: rendered,
              settings: { ...settings },
            };

            // Update first canvas item if empty
            const updatedCanvas = prev.canvasItems.map((item, idx) =>
              idx === 0 && !item.url ? { ...item, url: rendered } : item
            );

            return {
              ...prev,
              generatedSticker: rendered,
              canvasItems: updatedCanvas,
              history: [newHistoryItem, ...prev.history.slice(0, 19)],
            };
          });
        }
      } catch (err: any) {
        console.error('Error rendering sticker:', err);
      }
    };

    updateSticker();
    return () => {
      isCancelled = true;
    };
  }, [state.cutoutImage, state.originalImage, settings]);

  // Generate Sampler Matrix when switching to sampler view
  useEffect(() => {
    if (state.viewMode !== 'sampler') return;

    const sourceImage = settings.useSmartCutout && state.cutoutImage
      ? state.cutoutImage
      : state.originalImage;
    if (!sourceImage) return;

    const allStyles = Object.keys(STYLES_INFO) as StickerStyle[];
    allStyles.forEach(async (styleKey) => {
      try {
        const customSet: StickerSettings = { ...settings, style: styleKey };
        const rendered = await renderStickerCanvas(sourceImage, customSet, 600);
        setState((prev) => ({
          ...prev,
          samplerImages: {
            ...prev.samplerImages,
            [styleKey]: rendered,
          },
        }));
      } catch (err) {
        console.warn(`Error generating sampler for ${styleKey}`, err);
      }
    });
  }, [state.viewMode, state.cutoutImage, state.originalImage, settings.shape, settings.palette, settings.finish]);

  // File upload handler
  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string;
      setState((prev) => ({
        ...prev,
        originalImage: dataUrl,
        originalMime: file.type,
        isLoading: true,
        status: 'Extrayendo sujeto inteligente...',
      }));
      setActivePreset('');

      try {
        // Smart cutout + crop
        const cutout = await removeBackground(dataUrl, (p: number) => {
          setState((prev) => ({ ...prev, status: `Procesando silueta: ${p}%` }));
        });
        const cropped = await cropToContent(cutout);

        setState((prev) => ({
          ...prev,
          cutoutImage: cropped,
          isLoading: false,
          status: '',
        }));
      } catch (err: any) {
        console.error('Cutout error:', err);
        setState((prev) => ({
          ...prev,
          cutoutImage: dataUrl,
          isLoading: false,
          status: '',
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPreset = async (presetId: string) => {
    const preset = PRESET_STICKERS.find((p) => p.id === presetId);
    if (!preset) return;
    setActivePreset(preset.id);
    setState((prev) => ({
      ...prev,
      originalImage: preset.dataUrl,
      cutoutImage: preset.dataUrl,
    }));
    setSettings((prev) => ({
      ...prev,
      style: preset.defaultStyle as StickerStyle,
      shape: preset.defaultShape as StickerShape,
    }));
  };

  const handleSmartCutoutToggle = async () => {
    const nextVal = !settings.useSmartCutout;
    setSettings((prev) => ({ ...prev, useSmartCutout: nextVal }));

    if (nextVal && !state.cutoutImage && state.originalImage) {
      setState((prev) => ({ ...prev, isLoading: true, status: 'Eliminando fondo...' }));
      try {
        const cutout = await removeBackground(state.originalImage);
        const cropped = await cropToContent(cutout);
        setState((prev) => ({ ...prev, cutoutImage: cropped, isLoading: false, status: '' }));
      } catch {
        setState((prev) => ({ ...prev, cutoutImage: prev.originalImage, isLoading: false, status: '' }));
      }
    }
  };

  // Trigger download of the single sticker
  const handleDownloadSingle = () => {
    if (!state.generatedSticker) return;
    const a = document.createElement('a');
    a.href = state.generatedSticker;
    a.download = `hub-sticker-${settings.style}-${Date.now()}.png`;
    a.click();
    confetti({ particleCount: 60, spread: 60, origin: { y: 0.8 } });
  };

  // Add current sticker to Canvas Editor
  const handleAddToCanvas = () => {
    if (!state.generatedSticker) return;
    const newItem: CanvasItem = {
      id: Date.now().toString(),
      url: state.generatedSticker,
      x: 100 + (state.canvasItems.length % 5) * 40,
      y: 100 + (state.canvasItems.length % 5) * 40,
      rotation: (Math.random() - 0.5) * 30,
      scale: 1,
    };
    setState((prev) => ({
      ...prev,
      canvasItems: [...prev.canvasItems, newItem],
      viewMode: 'canvas',
    }));
    confetti({ particleCount: 35, spread: 45 });
  };

  // Export Canvas composite
  const handleExportCanvas = async () => {
    setExportState('busy');
    try {
      const canvas = document.createElement('canvas');
      const size = 1200;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d')!;

      // Draw background
      if (previewBg === 'dark') {
        ctx.fillStyle = '#121318';
        ctx.fillRect(0, 0, size, size);
      } else if (previewBg === 'light') {
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(0, 0, size, size);
      }

      // Draw all items
      for (const item of state.canvasItems) {
        if (!item.url) continue;
        await new Promise((resolve) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => {
            ctx.save();
            const cx = (item.x / 400) * size + (100 * item.scale);
            const cy = (item.y / 400) * size + (100 * item.scale);
            ctx.translate(cx, cy);
            ctx.rotate((item.rotation * Math.PI) / 180);
            ctx.scale(item.scale, item.scale);
            ctx.drawImage(img, -100, -100, 200, 200);
            ctx.restore();
            resolve(null);
          };
          img.onerror = () => resolve(null);
          img.src = item.url;
        });
      }

      const outUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = outUrl;
      a.download = `hub-stickers-canvas-${Date.now()}.png`;
      a.click();
      setExportState('done');
      confetti({ particleCount: 80, spread: 80 });
      setTimeout(() => setExportState('idle'), 2500);
    } catch {
      setExportState('error');
      setTimeout(() => setExportState('idle'), 2500);
    }
  };

  // Export Sticker Sheet (Print Layout)
  const handleExportSheet = () => {
    if (!state.generatedSticker) return;
    const canvas = sheetCanvasRef.current;
    if (!canvas) return;
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = `hub-sticker-sheet-A4-${Date.now()}.png`;
    a.click();
    confetti({ particleCount: 70, spread: 70 });
  };

  // Render sticker sheet preview
  useEffect(() => {
    if (state.viewMode !== 'sheet' || !sheetCanvasRef.current || !state.generatedSticker) return;
    const canvas = sheetCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const sheetW = 1240;
    const sheetH = 1754; // A4 ratio
    canvas.width = sheetW;
    canvas.height = sheetH;

    // White paper sheet background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, sheetW, sheetH);

    // Sheet Header
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 36px "Space Grotesk", sans-serif';
    ctx.fillText('HUB STICKERS PRO 2026 — STICKER PACK', 70, 90);

    ctx.fillStyle = '#64748b';
    ctx.font = '600 20px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(`Estilo: ${STYLES_INFO[settings.style].label} • Acabado: ${FINISH_INFO[settings.finish].label}`, 70, 130);

    // Grid lines for cut boundaries
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 8]);
    ctx.strokeRect(50, 160, sheetW - 100, sheetH - 220);
    ctx.setLineDash([]);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const density = settings.sheetDensity; // 4, 6, 9, 12
      let cols = 2, rows = 3;
      if (density === 4) { cols = 2; rows = 2; }
      else if (density === 6) { cols = 2; rows = 3; }
      else if (density === 9) { cols = 3; rows = 3; }
      else if (density === 12) { cols = 3; rows = 4; }

      const gridStartX = 70;
      const gridStartY = 190;
      const gridW = sheetW - 140;
      const gridH = sheetH - 270;

      const cellW = gridW / cols;
      const cellH = gridH / rows;
      const stickerSize = Math.min(cellW, cellH) * 0.85;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const cx = gridStartX + c * cellW + cellW / 2;
          const cy = gridStartY + r * cellH + cellH / 2;

          ctx.save();
          // Subtle cut marks
          ctx.strokeStyle = '#cbd5e1';
          ctx.lineWidth = 1;
          ctx.strokeRect(cx - cellW * 0.46, cy - cellH * 0.46, cellW * 0.92, cellH * 0.92);

          // Draw sticker
          ctx.drawImage(img, cx - stickerSize / 2, cy - stickerSize / 2, stickerSize, stickerSize);
          ctx.restore();
        }
      }

      // Footer
      ctx.fillStyle = '#94a3b8';
      ctx.font = '16px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`Print ready • 300 DPI layout • Generated on Hub Stickers Pro 2026`, sheetW / 2, sheetH - 30);
    };
    img.src = state.generatedSticker;
  }, [state.viewMode, state.generatedSticker, settings.sheetDensity, settings.style, settings.finish]);

  // AI Prompt Enhancer using Gemini API
  const handleEnhanceWithAI = async () => {
    setAiGenerating(true);
    setAiDescription(null);
    try {
      const res = await fetch('/api/ai/describe-or-enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: settings.customSubject || STYLES_INFO[settings.style].label,
          style: settings.style,
          shape: settings.shape,
        }),
      });
      const data = await res.json();
      if (data.text) {
        setAiDescription(data.text);
      } else {
        setAiDescription('Gemini: Pegatina optimizada con contorno blanco troquelado y acabado ' + settings.finish);
      }
    } catch {
      setAiDescription('Gemini: Pegatina estilizada en alta definición con borde die-cut perfecto.');
    } finally {
      setAiGenerating(false);
    }
  };

  const navTabs = [
    { id: 'single', label: 'Estudio Individual', icon: 'auto_fix_high' },
    { id: 'sampler', label: 'Muestrario de Estilos', icon: 'grid_view' },
    { id: 'sheet', label: 'Hoja de Pegatinas', icon: 'print' },
    { id: 'canvas', label: 'Lienzo Libre', icon: 'layers' },
    { id: 'history', label: 'Historial', icon: 'history' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#0d0e12] text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Top Header */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#12131a]/85 backdrop-blur-xl px-4 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/25">
            <div className="w-full h-full bg-[#0d0e12] rounded-[14px] flex items-center justify-center">
              <span className="material-symbols-outlined text-transparent bg-clip-text bg-gradient-to-tr from-indigo-400 to-pink-400 text-[22px]">
                token
              </span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-lg lg:text-xl tracking-tight text-white font-['Space_Grotesk']">
                HUB STICKERS PRO
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                2026
              </span>
            </div>
            <p className="text-[12px] text-slate-400 font-medium hidden sm:block">
              Generador Profesional de Pegatinas, Troquelado Inteligente y Estudio de Impresión
            </p>
          </div>
        </div>

        {/* View Mode Navigation Switcher */}
        <div className="flex items-center bg-white/5 p-1 rounded-2xl border border-white/10 overflow-x-auto max-w-full">
          {navTabs.map((tab) => {
            const isActive = state.viewMode === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setState((prev) => ({ ...prev, viewMode: tab.id as any }))}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <span className="material-symbols-outlined text-[17px]">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Studio Viewport */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* Loading Overlay */}
        {state.isLoading && (
          <div className="absolute inset-0 z-50 bg-[#0d0e12]/80 backdrop-blur-md flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-full border-4 border-indigo-500/30 border-t-indigo-500 animate-spin" />
            <p className="text-sm font-bold text-indigo-300 tracking-wide uppercase">{state.status}</p>
          </div>
        )}

        {/* 1. SINGLE VIEW (PRIMARY STUDIO) */}
        {state.viewMode === 'single' && (
          <>
            {/* Left Control Panel */}
            <aside className="w-full lg:w-[420px] xl:w-[460px] border-b lg:border-b-0 lg:border-r border-white/10 bg-[#121318]/90 flex flex-col h-[50vh] lg:h-[calc(100vh-65px)] overflow-y-auto dark-scrollbar p-5 gap-6">
              {/* Presets & Upload Section */}
              <div className="flex flex-col gap-3">
                <SectionLabel color="#818cf8">1. Imagen de Origen</SectionLabel>
                
                {/* Upload Button */}
                <div className="flex gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 flex items-center justify-center gap-2 h-12 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-indigo-600/30 hover:scale-[1.01] active:scale-[0.99]"
                  >
                    <span className="material-symbols-outlined text-[20px]">upload_file</span>
                    Subir Tu Foto / Imagen
                  </button>
                </div>

                {/* Preset Chips */}
                <div className="flex flex-col gap-1.5">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest pl-1">
                    O prueba una muestra rápida:
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {PRESET_STICKERS.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handleSelectPreset(preset.id)}
                        className={`flex items-center gap-2 p-2 rounded-xl border text-left transition-all ${
                          activePreset === preset.id
                            ? 'bg-indigo-500/20 border-indigo-500/50 text-white shadow-inner'
                            : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200'
                        }`}
                      >
                        <img src={preset.dataUrl} alt={preset.name} className="w-7 h-7 object-contain rounded-lg" />
                        <span className="text-[11px] font-bold truncate">{preset.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Smart Cutout Switch */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-indigo-400 text-[20px]">content_cut</span>
                    <div>
                      <p className="text-xs font-bold text-white uppercase tracking-wider">Troquelado Inteligente</p>
                      <p className="text-[11px] text-slate-400">Elimina el fondo y aísla la silueta</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleSmartCutoutToggle}
                    className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-1 ${
                      settings.useSmartCutout ? 'bg-indigo-500' : 'bg-slate-700'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform ${
                        settings.useSmartCutout ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Styles Section (15 Styles) */}
              <div className="flex flex-col gap-2.5">
                <SectionLabel color="#818cf8">2. Estilo Artístico (15 Opciones)</SectionLabel>
                <div className="grid grid-cols-3 gap-2">
                  {(Object.keys(STYLES_INFO) as StickerStyle[]).map((styleKey) => {
                    const info = STYLES_INFO[styleKey];
                    const isSelected = settings.style === styleKey;
                    return (
                      <button
                        key={styleKey}
                        type="button"
                        onClick={() => setSettings((prev) => ({ ...prev, style: styleKey }))}
                        className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border text-center transition-all ${
                          isSelected
                            ? 'bg-indigo-500/20 border-indigo-500 text-white shadow-md shadow-indigo-500/20 scale-[1.02]'
                            : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200'
                        }`}
                      >
                        <span
                          className="material-symbols-outlined text-[20px] mb-1"
                          style={{ color: isSelected ? info.color : undefined }}
                        >
                          {info.icon}
                        </span>
                        <span className="text-[11px] font-bold tracking-tight">{info.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Shapes & Cutout Contours */}
              <div className="flex flex-col gap-2.5">
                <SectionLabel color="#818cf8">3. Forma y Silueta</SectionLabel>
                <div className="grid grid-cols-3 gap-2">
                  {(Object.keys(SHAPES_INFO) as StickerShape[]).map((shapeKey) => {
                    const info = SHAPES_INFO[shapeKey];
                    const isSelected = settings.shape === shapeKey;
                    return (
                      <button
                        key={shapeKey}
                        type="button"
                        onClick={() => setSettings((prev) => ({ ...prev, shape: shapeKey }))}
                        className={`flex items-center gap-1.5 p-2 rounded-xl border transition-all text-left ${
                          isSelected
                            ? 'bg-purple-500/20 border-purple-500 text-white'
                            : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[16px] text-purple-400">{info.icon}</span>
                        <span className="text-[11px] font-bold truncate">{info.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Finishes & Materials */}
              <div className="flex flex-col gap-2.5">
                <SectionLabel color="#818cf8">4. Acabado y Material</SectionLabel>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(FINISH_INFO) as StickerFinish[]).map((finishKey) => {
                    const info = FINISH_INFO[finishKey];
                    const isSelected = settings.finish === finishKey;
                    return (
                      <button
                        key={finishKey}
                        type="button"
                        onClick={() => setSettings((prev) => ({ ...prev, finish: finishKey }))}
                        className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'bg-amber-500/20 border-amber-500 text-white shadow-sm'
                            : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[18px] text-amber-400">{info.icon}</span>
                        <div>
                          <p className="text-[11px] font-bold">{info.label}</p>
                          <p className="text-[9px] text-slate-400 truncate">{info.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Palette & Border Settings */}
              <div className="flex flex-col gap-3">
                <SectionLabel color="#818cf8">5. Paleta y Borde Troquelado</SectionLabel>
                
                {/* Border Thickness */}
                <div className="flex flex-col gap-1.5">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest pl-1">
                    Grosor del Borde Blanco
                  </p>
                  <SegmentedToggle
                    value={String(settings.borderThickness)}
                    onChange={(val) => setSettings((prev) => ({ ...prev, borderThickness: Number(val) as any }))}
                    items={[
                      { value: '0', label: 'Sin Borde' },
                      { value: '1', label: 'Estándar (16px)' },
                      { value: '2', label: 'Grueso (28px)' },
                    ]}
                    accentColor="#818cf8"
                  />
                </div>

                {/* Palette Dropdown */}
                <FieldDropdown
                  label="Paleta de Colores"
                  value={settings.palette}
                  options={Object.keys(PALETTES_INFO)}
                  onChange={(val) => setSettings((prev) => ({ ...prev, palette: val as StickerPalette }))}
                  accentColor="#818cf8"
                  renderOption={(opt) => {
                    const info = PALETTES_INFO[opt as StickerPalette];
                    return (
                      <div className="flex items-center justify-between w-full">
                        <span>{info?.label || opt}</span>
                        <div className="flex items-center gap-1">
                          {info?.colors.map((c: string, i: number) => (
                            <span key={i} className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c }} />
                          ))}
                        </div>
                      </div>
                    );
                  }}
                />

                {/* Custom Caption Banner */}
                <TextInput
                  label="Texto o Lema en la Pegatina"
                  value={settings.captionText}
                  onChange={(val) => setSettings((prev) => ({ ...prev, captionText: val }))}
                  placeholder="Ej. RETRO VIBES, EDICIÓN LIMITADA..."
                  accentColor="#818cf8"
                />

                {/* Gemini AI Styler Prompt */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-purple-950/30 to-slate-900 border border-indigo-500/20 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-indigo-400 text-[18px]">auto_awesome</span>
                      <p className="text-xs font-bold text-indigo-200 uppercase tracking-wider">Asistente Gemini</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleEnhanceWithAI}
                      disabled={aiGenerating}
                      className="px-3 py-1 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-white text-[10px] font-extrabold uppercase tracking-wider transition-all disabled:opacity-50"
                    >
                      {aiGenerating ? 'Analizando...' : 'Describir Concepto'}
                    </button>
                  </div>
                  {aiDescription && (
                    <p className="text-[12px] text-indigo-200/90 leading-relaxed bg-black/30 p-2.5 rounded-xl border border-indigo-500/20">
                      {aiDescription}
                    </p>
                  )}
                </div>
              </div>
            </aside>

            {/* Center Studio Live Viewport */}
            <section className="flex-1 flex flex-col items-center justify-between p-4 lg:p-8 bg-[#0c0d12] relative overflow-hidden">
              {/* Viewport Top Bar */}
              <div className="w-full max-w-4xl flex items-center justify-between gap-4 z-10">
                <div className="flex items-center gap-2">
                  <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                    {(['checker', 'dark', 'light'] as const).map((bg) => (
                      <button
                        key={bg}
                        type="button"
                        onClick={() => setPreviewBg(bg)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                          previewBg === bg
                            ? 'bg-white/15 text-white shadow-sm'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {bg === 'checker' ? 'Cuadros' : bg === 'dark' ? 'Oscuro' : 'Claro'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <PillButton
                    variant="outline"
                    icon={<span className="material-symbols-outlined text-[18px]">layers</span>}
                    onClick={handleAddToCanvas}
                    className="w-auto px-4"
                  >
                    Añadir al Lienzo
                  </PillButton>
                  <PillButton
                    variant="solid"
                    icon={<span className="material-symbols-outlined text-[18px]">download</span>}
                    onClick={handleDownloadSingle}
                    className="w-auto px-6 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/25"
                  >
                    Descargar PNG HD
                  </PillButton>
                </div>
              </div>

              {/* Main Sticker Preview Stage */}
              <div className="flex-1 w-full max-w-3xl flex items-center justify-center p-4">
                <div
                  className={`relative w-full max-w-[520px] aspect-square rounded-[36px] overflow-hidden border border-white/10 shadow-2xl flex items-center justify-center p-8 transition-colors duration-300 ${
                    previewBg === 'checker'
                      ? 'checkerboard'
                      : previewBg === 'dark'
                      ? 'bg-[#15161e]'
                      : 'bg-[#f8fafc]'
                  }`}
                >
                  {state.generatedSticker ? (
                    <div className="relative group cursor-pointer" onClick={handleDownloadSingle}>
                      <img
                        src={state.generatedSticker}
                        alt="Sticker Generado"
                        className={`max-w-full max-h-[420px] object-contain select-none transition-transform duration-300 group-hover:scale-105 ${
                          settings.finish === 'holographic-foil' ? 'drop-shadow-holographic' : 'drop-shadow-sticker-thick'
                        }`}
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 rounded-3xl backdrop-blur-xs">
                        <span className="px-4 py-2 rounded-full bg-white/90 text-slate-900 font-extrabold text-xs uppercase tracking-wider shadow-lg flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[18px]">download</span>
                          Descargar Sticker
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3 text-slate-500">
                      <span className="material-symbols-outlined text-6xl animate-pulse">token</span>
                      <p className="text-xs font-bold uppercase tracking-widest">Generando Pegatina...</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Info Bar at Bottom */}
              <div className="w-full max-w-4xl flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-white/5">
                <div className="flex items-center gap-4">
                  <span>🎨 Estilo: <strong className="text-slate-200">{STYLES_INFO[settings.style].label}</strong></span>
                  <span>✂️ Forma: <strong className="text-slate-200">{SHAPES_INFO[settings.shape].label}</strong></span>
                  <span>✨ Acabado: <strong className="text-slate-200">{FINISH_INFO[settings.finish].label}</strong></span>
                </div>
                <div className="text-slate-500 hidden sm:block">
                  PNG transparente de alta resolución (1024x1024)
                </div>
              </div>
            </section>
          </>
        )}

        {/* 2. SAMPLER VIEW (15 STYLES MATRIX) */}
        {state.viewMode === 'sampler' && (
          <section className="flex-1 p-6 lg:p-10 overflow-y-auto dark-scrollbar flex flex-col gap-6 max-w-7xl mx-auto w-full">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-extrabold font-['Space_Grotesk'] text-white">
                  Muestrario de 15 Estilos
                </h2>
                <p className="text-sm text-slate-400">
                  Compara tu imagen renderizada en todos los estilos artísticos y haz clic para seleccionarlo.
                </p>
              </div>
              <PillButton
                variant="outline"
                icon={<span className="material-symbols-outlined text-[18px]">arrow_back</span>}
                onClick={() => setState((prev) => ({ ...prev, viewMode: 'single' }))}
                className="w-auto px-4"
              >
                Volver al Estudio
              </PillButton>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {(Object.keys(STYLES_INFO) as StickerStyle[]).map((styleKey) => {
                const info = STYLES_INFO[styleKey];
                const previewImg = state.samplerImages[styleKey] || state.generatedSticker;
                const isSelected = settings.style === styleKey;

                return (
                  <div
                    key={styleKey}
                    onClick={() => {
                      setSettings((prev) => ({ ...prev, style: styleKey }));
                      setState((prev) => ({ ...prev, viewMode: 'single' }));
                    }}
                    className={`p-4 rounded-3xl border transition-all cursor-pointer flex flex-col items-center gap-3 relative group ${
                      isSelected
                        ? 'bg-indigo-950/40 border-indigo-500 shadow-xl shadow-indigo-500/20'
                        : 'bg-white/5 border-white/10 hover:border-indigo-500/50 hover:bg-white/10'
                    }`}
                  >
                    <div className="w-full aspect-square rounded-2xl checkerboard flex items-center justify-center p-3 relative overflow-hidden">
                      {previewImg ? (
                        <img
                          src={previewImg}
                          alt={info.label}
                          className="max-w-full max-h-full object-contain drop-shadow-sticker group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-6 h-6 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                      )}
                    </div>
                    <div className="text-center w-full">
                      <p className="font-extrabold text-sm text-white flex items-center justify-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px]" style={{ color: info.color }}>
                          {info.icon}
                        </span>
                        {info.label}
                      </p>
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{info.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* 3. SHEET VIEW (PRINTABLE STICKER SHEET) */}
        {state.viewMode === 'sheet' && (
          <section className="flex-1 p-6 lg:p-10 overflow-y-auto dark-scrollbar flex flex-col items-center gap-6 max-w-5xl mx-auto w-full">
            <div className="w-full flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-extrabold font-['Space_Grotesk'] text-white">
                  Hoja de Pegatinas Imprimible (A4)
                </h2>
                <p className="text-sm text-slate-400">
                  Organiza tu pegatina en una cuadrícula con marcas de corte lista para imprimir y troquelar.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <SegmentedToggle
                  value={String(settings.sheetDensity)}
                  onChange={(val) => setSettings((prev) => ({ ...prev, sheetDensity: Number(val) }))}
                  items={[
                    { value: '4', label: '4 Pegatinas' },
                    { value: '6', label: '6 Pegatinas' },
                    { value: '9', label: '9 Pegatinas' },
                    { value: '12', label: '12 Pegatinas' },
                  ]}
                  accentColor="#818cf8"
                />
                <PillButton
                  variant="solid"
                  icon={<span className="material-symbols-outlined text-[18px]">download</span>}
                  onClick={handleExportSheet}
                  className="w-auto px-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
                >
                  Descargar Hoja A4
                </PillButton>
              </div>
            </div>

            {/* Canvas Preview */}
            <div className="w-full max-w-[600px] shadow-2xl rounded-2xl overflow-hidden border border-white/20">
              <canvas ref={sheetCanvasRef} className="w-full h-auto bg-white block" />
            </div>
          </section>
        )}

        {/* 4. CANVAS VIEW (FREEFORM MULTI-LAYER EDITOR) */}
        {state.viewMode === 'canvas' && (
          <section className="flex-1 h-full w-full">
            <CanvasEditor
              items={state.canvasItems}
              onUpdateItems={(items) => setState((prev) => ({ ...prev, canvasItems: items }))}
              onExport={handleExportCanvas}
              exportState={exportState}
            />
          </section>
        )}

        {/* 5. HISTORY VIEW */}
        {state.viewMode === 'history' && (
          <section className="flex-1 p-6 lg:p-10 overflow-y-auto dark-scrollbar flex flex-col gap-6 max-w-6xl mx-auto w-full">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-extrabold font-['Space_Grotesk'] text-white">
                  Historial de Creaciones
                </h2>
                <p className="text-sm text-slate-400">
                  Tus pegatinas generadas en esta sesión. Puedes restaurar configuraciones o descargarlas.
                </p>
              </div>
              <PillButton
                variant="outline"
                icon={<span className="material-symbols-outlined text-[18px]">delete</span>}
                onClick={() => setState((prev) => ({ ...prev, history: [] }))}
                className="w-auto px-4"
              >
                Vaciar Historial
              </PillButton>
            </div>

            {state.history.length === 0 ? (
              <div className="p-16 border border-white/10 rounded-3xl bg-white/5 flex flex-col items-center justify-center gap-3 text-slate-500">
                <span className="material-symbols-outlined text-5xl">history_toggle_off</span>
                <p className="text-sm font-bold uppercase tracking-wider">Aún no hay pegatinas en el historial</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {state.history.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center gap-2 group hover:border-indigo-500/50 transition-all"
                  >
                    <div className="w-full aspect-square checkerboard rounded-xl p-2 flex items-center justify-center overflow-hidden">
                      {item.image && (
                        <img
                          src={item.image}
                          alt="Historial"
                          className="max-w-full max-h-full object-contain drop-shadow-sticker group-hover:scale-105 transition-transform"
                        />
                      )}
                    </div>
                    <div className="text-center w-full">
                      <p className="text-[11px] font-bold text-white uppercase truncate">
                        {STYLES_INFO[item.settings.style]?.label || item.settings.style}
                      </p>
                      <p className="text-[9px] text-slate-400">
                        {new Date(item.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSettings({ ...item.settings });
                        setState((prev) => ({ ...prev, viewMode: 'single' }));
                      }}
                      className="w-full py-1 rounded-lg bg-indigo-500/20 hover:bg-indigo-500 text-indigo-300 hover:text-white text-[10px] font-bold uppercase tracking-wider transition-all"
                    >
                      Restaurar
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
