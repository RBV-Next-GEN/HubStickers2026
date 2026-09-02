import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Sun,
  Moon,
  Upload,
  Download,
  Copy,
  Check,
  RotateCw,
  Sparkles,
  Scissors,
  Layers,
  Printer,
  Grid,
  History,
  Palette,
  Heart,
  Square,
  Circle,
  ShieldCheck,
  Hexagon,
  Eye,
  Sliders,
  Type,
  Trash2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Wand2,
  RefreshCw,
  Plus,
  ArrowRight,
  Info,
  CheckCircle2,
  Disc,
  Zap,
  Waves,
  Box,
  PenTool,
  Gamepad2,
  Paintbrush,
  SprayCan,
  Triangle,
  Droplet,
  Flame,
  Award,
  Crown,
  Undo2,
  Redo2,
  FileCode2,
  BookOpen,
  Image as ImageIcon,
  ChevronsUpDown,
  Cpu,
  Bot,
  ChevronLeft,
  ChevronUp,
  Pin,
  Share2,
  MoreVertical,
  Star,
  Users,
  Film,
  FolderUp,
  LayoutGrid,
  PanelLeftClose,
  PanelLeft,
  X
} from 'lucide-react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import {
  StickerStyle,
  StickerShape,
  StickerPalette,
  StickerFinish,
  StickerSettings,
  StickerState,
  CanvasItem,
  HistoryItem,
  AiEngine
} from '../types';
import { CanvasEditor } from '../components/CanvasEditor';
import { FlowSidebar } from './components/FlowSidebar';
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
  AI_ENGINES_INFO,
  renderStickerCanvas
} from '../services/stickerStyler';
import { removeBackground } from '../services/backgroundRemoval';
import { cropToContent } from '../services/imageProcessing';
import { PRESET_STICKERS } from './presets';

const DEFAULT_SETTINGS: StickerSettings = {
  aiEngine: 'nano-banana-pro',
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

// Lucide icon mapping for shapes
const SHAPE_ICONS: Record<StickerShape, React.ReactNode> = {
  'die-cut': <Scissors className="w-4 h-4" />,
  'circle': <Circle className="w-4 h-4" />,
  'square': <Square className="w-4 h-4" />,
  'badge': <ShieldCheck className="w-4 h-4" />,
  'heart': <Heart className="w-4 h-4" />,
  'hexagon': <Hexagon className="w-4 h-4" />
};

// Lucide icon mapping for styles
const STYLE_ICONS: Record<StickerStyle, React.ReactNode> = {
  'minimalist': <Square className="w-3.5 h-3.5" />,
  'pop-art': <Palette className="w-3.5 h-3.5" />,
  'kawaii': <Heart className="w-3.5 h-3.5" />,
  'retro-vinyl': <Disc className="w-3.5 h-3.5" />,
  'cyberpunk': <Zap className="w-3.5 h-3.5" />,
  'holographic': <Sparkles className="w-3.5 h-3.5" />,
  'vaporwave': <Waves className="w-3.5 h-3.5" />,
  '3d-render': <Box className="w-3.5 h-3.5" />,
  'ink-sketch': <PenTool className="w-3.5 h-3.5" />,
  'pixel-art': <Gamepad2 className="w-3.5 h-3.5" />,
  'watercolor': <Paintbrush className="w-3.5 h-3.5" />,
  'embroidery': <Scissors className="w-3.5 h-3.5" />,
  'graffiti': <SprayCan className="w-3.5 h-3.5" />,
  'origami': <Triangle className="w-3.5 h-3.5" />,
  'clear-vinyl': <Droplet className="w-3.5 h-3.5" />
};

// Lucide icon and swatch mapping for finishes
const FINISH_ICONS: Record<StickerFinish, React.ReactNode> = {
  'glossy': <Sun className="w-4 h-4 text-amber-500" />,
  'matte': <Sliders className="w-4 h-4 text-slate-400" />,
  'glitter': <Sparkles className="w-4 h-4 text-pink-500" />,
  'holographic-foil': <Wand2 className="w-4 h-4 text-purple-500" />,
  'metallic': <Crown className="w-4 h-4 text-yellow-500" />
};

export default function App() {
  // Theme state: dark / light
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('hub_sticker_theme');
      if (saved === 'light' || saved === 'dark') return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'dark';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('hub_sticker_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

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
  const [previewBg, setPreviewBg] = useState<'checker' | 'dark' | 'light' | 'desk'>('checker');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [copiedNotification, setCopiedNotification] = useState(false);
  const [exportState, setExportState] = useState<'idle' | 'busy' | 'done' | 'error'>('idle');
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiDescription, setAiDescription] = useState<string | null>(null);

  // AI Generator Modal state
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiSubjectPrompt, setAiSubjectPrompt] = useState('Gatito astronauta con traje retro y casco espacial');
  const [aiUseReference, setAiUseReference] = useState(false);
  const [isAiCreating, setIsAiCreating] = useState(false);

  // Technical Docs Modal state
  const [isDocsModalOpen, setIsDocsModalOpen] = useState(false);

  // 3D Tilt effect on sticker preview
  const [tilt, setTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const sheetCanvasRef = useRef<HTMLCanvasElement>(null);

  // Handle Download Project ZIP (Código y activos de la pegatina)
  const handleDownloadZip = async () => {
    try {
      const zip = new JSZip();
      zip.file(
        'README.txt',
        'HUB STICKERS PRO 2026 - Proyecto de Pegatina\n\nGenerado con Google Flow & Hub Stickers Pro.\nDiseñado para corte troquelado y producción de vinilos en alta fidelidad.'
      );
      zip.file(
        'configuracion_pegatina.json',
        JSON.stringify(
          {
            version: '2026.1',
            motor: settings.aiEngine,
            estilo: settings.style,
            forma: settings.shape,
            acabado: settings.finish,
            paleta: settings.palette,
            grosorBorde: settings.borderThickness,
            fondo: settings.backgroundColor,
            encuadre: settings.croppingMode,
            textoLema: settings.captionText,
            sujetoPrompt: aiSubjectPrompt
          },
          null,
          2
        )
      );

      if (state.generatedSticker) {
        const base64Data = state.generatedSticker.split(',')[1];
        if (base64Data) {
          zip.file('pegatina_alta_resolucion.png', base64Data, { base64: true });
        }
      }
      if (state.cutoutImage) {
        const base64Cutout = state.cutoutImage.split(',')[1];
        if (base64Cutout) {
          zip.file('silueta_recorte_alfa.png', base64Cutout, { base64: true });
        }
      }

      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, `hub-stickers-pro-${settings.style}-${Date.now()}.zip`);
      confetti({ particleCount: 50, spread: 60 });
    } catch (err) {
      console.error('Error al exportar ZIP:', err);
    }
  };

  // Main Generator Button Handler (EL BOTÓN MÁS IMPORTANTE)
  const handleGenerateMainSticker = async () => {
    if (isAiCreating || state.isLoading) return;

    if (aiSubjectPrompt && aiSubjectPrompt.trim()) {
      await handleGenerateAiSticker();
    } else if (state.cutoutImage || state.originalImage) {
      setState((prev) => ({ ...prev, isLoading: true, status: 'Renderizando pegatina con acabados físicos...' }));
      try {
        const sourceImage = settings.useSmartCutout && state.cutoutImage
          ? state.cutoutImage
          : (state.originalImage || state.cutoutImage);
        if (sourceImage) {
          const rendered = await renderStickerCanvas(sourceImage, settings, 1024);
          setState((prev) => ({ ...prev, generatedSticker: rendered, isLoading: false, status: '' }));
          confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
        }
      } catch (e: any) {
        setState((prev) => ({ ...prev, isLoading: false, status: '', error: e?.message }));
      }
    } else {
      setAiSubjectPrompt('Gatito astronauta con traje retro y casco espacial');
      await handleGenerateAiSticker();
    }
  };

  // Helper to push snapshot to Undo stack
  const saveSnapshot = (customSettings?: StickerSettings, customImage?: string | null) => {
    const snap: HistoryItem = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      image: customImage || state.cutoutImage || state.originalImage,
      settings: customSettings ? { ...customSettings } : { ...settings },
    };
    setState((prev) => ({
      ...prev,
      undoStack: [snap, ...prev.undoStack.slice(0, 19)],
      redoStack: [],
    }));
  };

  const handleUndo = () => {
    if (state.undoStack.length === 0) return;
    const [lastSnap, ...restUndo] = state.undoStack;
    const currentSnap: HistoryItem = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      image: state.cutoutImage || state.originalImage,
      settings: { ...settings },
    };

    setSettings(lastSnap.settings);
    if (lastSnap.image) {
      setState((prev) => ({
        ...prev,
        cutoutImage: lastSnap.image,
        originalImage: lastSnap.image,
        undoStack: restUndo,
        redoStack: [currentSnap, ...prev.redoStack],
      }));
    } else {
      setState((prev) => ({
        ...prev,
        undoStack: restUndo,
        redoStack: [currentSnap, ...prev.redoStack],
      }));
    }
  };

  const handleRedo = () => {
    if (state.redoStack.length === 0) return;
    const [nextSnap, ...restRedo] = state.redoStack;
    const currentSnap: HistoryItem = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      image: state.cutoutImage || state.originalImage,
      settings: { ...settings },
    };

    setSettings(nextSnap.settings);
    if (nextSnap.image) {
      setState((prev) => ({
        ...prev,
        cutoutImage: nextSnap.image,
        originalImage: nextSnap.image,
        redoStack: restRedo,
        undoStack: [currentSnap, ...prev.undoStack],
      }));
    } else {
      setState((prev) => ({
        ...prev,
        redoStack: restRedo,
        undoStack: [currentSnap, ...prev.undoStack],
      }));
    }
  };

  // Keyboard shortcut for undo/redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        handleRedo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.undoStack, state.redoStack, settings]);

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

            const updatedCanvas = prev.canvasItems.map((item, idx) =>
              idx === 0 && !item.url ? { ...item, url: rendered } : item
            );

            return {
              ...prev,
              generatedSticker: rendered,
              canvasItems: updatedCanvas,
              history: [newHistoryItem, ...prev.history.filter((h) => h.image !== rendered).slice(0, 23)],
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
      } catch (e) {
        console.error('Sampler render error:', e);
      }
    });
  }, [state.viewMode, state.cutoutImage, state.originalImage, settings.shape, settings.finish, settings.palette, settings.borderThickness]);

  // Handle local image file upload
  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    saveSnapshot();
    setState((prev) => ({ ...prev, isLoading: true, status: 'Cargando imagen...', error: null }));

    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string;
      setState((prev) => ({
        ...prev,
        originalImage: dataUrl,
        originalMime: file.type,
        status: 'Detectando silueta con Xenova/modnet...',
      }));
      setActivePreset('');

      try {
        const cutout = await removeBackground(dataUrl, (p: number) => {
          setState((prev) => ({ ...prev, status: `Procesando silueta IA: ${p}%` }));
        });
        const cropped = await cropToContent(cutout);
        setState((prev) => ({
          ...prev,
          cutoutImage: cropped,
          isLoading: false,
          status: '',
        }));
        confetti({ particleCount: 40, spread: 50 });
      } catch {
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
    saveSnapshot();
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
    saveSnapshot();
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

  // AI Sticker Generation endpoint handler
  const handleGenerateAiSticker = async () => {
    if (!aiSubjectPrompt.trim()) return;
    setIsAiCreating(true);
    saveSnapshot();
    const engineLabel = AI_ENGINES_INFO[settings.aiEngine]?.label || 'Nano Banana Pro';
    setState((prev) => ({ ...prev, isLoading: true, status: `Generando pegatina con IA (${engineLabel})...` }));

    try {
      const referenceData = aiUseReference ? (state.cutoutImage || state.originalImage) : null;
      const res = await fetch('/api/ai/generate-sticker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: aiSubjectPrompt,
          style: settings.style,
          shape: settings.shape,
          finish: settings.finish,
          borderThickness: settings.borderThickness,
          referenceImage: referenceData,
          aiEngine: settings.aiEngine,
        }),
      });

      const data = await res.json();
      if (data.success && data.imageUrl) {
        setState((prev) => ({ ...prev, status: 'Aislando silueta transparente...' }));
        const cutout = await removeBackground(data.imageUrl);
        const cropped = await cropToContent(cutout);

        setState((prev) => ({
          ...prev,
          originalImage: data.imageUrl,
          cutoutImage: cropped,
          isLoading: false,
          status: '',
        }));
        setIsAiModalOpen(false);
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      } else {
        throw new Error(data.error || 'Error al generar la imagen');
      }
    } catch (err: any) {
      console.error('AI generate sticker error:', err);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        status: '',
        error: err.message || 'No se pudo generar el sticker con IA.',
      }));
    } finally {
      setIsAiCreating(false);
    }
  };

  // Trigger download of single sticker (PNG)
  const handleDownloadSingle = () => {
    if (!state.generatedSticker) return;
    const a = document.createElement('a');
    a.href = state.generatedSticker;
    a.download = `hub-sticker-${settings.style}-${Date.now()}.png`;
    a.click();
    confetti({ particleCount: 60, spread: 60, origin: { y: 0.8 } });
  };

  // Download Technical Documentation
  const handleDownloadDocs = () => {
    const docContent = `# DOCUMENTACIÓN TÉCNICA: HUB STICKERS PRO 2026

## 1. DESCRIPCIÓN GENERAL
HUB STICKERS PRO 2026 es una aplicación de vanguardia diseñada para la creación, edición y diseño de pegatinas (stickers) personalizadas utilizando Inteligencia Artificial generativa y procesamiento de imágenes local.

## 2. ARQUITECTURA DEL SISTEMA
La herramienta está construida como una Flow Tool, ejecutándose en un entorno sandbox seguro (iframe) utilizando:
- **Framework:** React 19 con TypeScript.
- **Estilos:** Tailwind CSS v4.
- **Interacción:** Framer Motion (motion/react) para el lienzo de diseño.
- **IA Generativa:** Google Flow SDK para modelos de imagen (Nano Banana / Gemini).
- **IA Local:** Transformers.js para eliminación de fondo mediante el modelo Xenova/modnet.

## 3. PROCESOS CLAVE Y FLUJO DE DATOS
### A. Adquisición de Imagen (Input)
- Selección de archivos desde galería o cámara, y generación de sujeto mediante prompts de IA.
### B. Segmentación y Recorte (Smart Cutout)
- Xenova/modnet ejecutado via WebWorker/WebGPU para generar máscaras alfa de alta fidelidad.
### C. Generación con IA (Inpainting & Style Transfer)
- Construcción dinámica de prompts: Sujeto + Modificadores de Estilo + Parámetros Físicos + Restricciones Negativas.
### D. Optimización de Espacio (Tight Crop)
- Algoritmo \`cropToContent\` para eliminar márgenes vacíos y centrar la silueta.
### E. Diseño y Composición (Canvas Editor)
- Multi-capa con arrastre, rotación, escalado y gestión de profundidad Z-index.

## 4. INTEGRACIÓN CON FLOW SDK (API)
1. **Flow.media.select:** Selección de archivos.
2. **Flow.generate.image:** Invocación de modelos generativos Nano Banana / Gemini.
3. **Flow.upload:** Registro temporal de imágenes procesadas como referencia visual.
4. **Flow.download:** Exportación final de archivos (Stickers HD, Planillas A4, Composiciones, Código y Documentación).
`;
    const blob = new Blob([docContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'HUB_STICKERS_PRO_2026_DOCUMENTATION.md';
    a.click();
    URL.revokeObjectURL(url);
    confetti({ particleCount: 40, spread: 50 });
  };

  // Copy sticker image to clipboard
  const handleCopyImage = async () => {
    if (!state.generatedSticker) return;
    try {
      const res = await fetch(state.generatedSticker);
      const blob = await res.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      setCopiedNotification(true);
      setTimeout(() => setCopiedNotification(false), 2500);
    } catch {
      setCopiedNotification(true);
      setTimeout(() => setCopiedNotification(false), 2000);
    }
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

      if (previewBg === 'dark') {
        ctx.fillStyle = '#0f1016';
        ctx.fillRect(0, 0, size, size);
      } else if (previewBg === 'light') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, size, size);
      }

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
    const sheetH = 1754;
    canvas.width = sheetW;
    canvas.height = sheetH;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, sheetW, sheetH);

    // Header
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 36px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('HUB STICKERS PRO 2026 — PACK DE IMPRESIÓN', 70, 90);

    ctx.fillStyle = '#64748b';
    ctx.font = '600 20px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(`Estilo: ${STYLES_INFO[settings.style].label} • Acabado: ${FINISH_INFO[settings.finish].label}`, 70, 130);

    // Grid cut bounds
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 8]);
    ctx.strokeRect(50, 160, sheetW - 100, sheetH - 220);
    ctx.setLineDash([]);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const density = settings.sheetDensity;
      let cols = 2, rows = 3;
      if (density === 4) { cols = 2; rows = 2; }
      else if (density === 6) { cols = 2; rows = 3; }
      else if (density === 9) { cols = 3; rows = 3; }
      else if (density === 12) { cols = 3; rows = 4; }
      else if (density === 16) { cols = 4; rows = 4; }

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
          ctx.strokeStyle = '#e2e8f0';
          ctx.lineWidth = 1;
          ctx.strokeRect(cx - cellW * 0.46, cy - cellH * 0.46, cellW * 0.92, cellH * 0.92);
          ctx.drawImage(img, cx - stickerSize / 2, cy - stickerSize / 2, stickerSize, stickerSize);
          ctx.restore();
        }
      }

      ctx.fillStyle = '#94a3b8';
      ctx.font = '16px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`Print ready • 300 DPI layout • Hub Stickers Pro Studio Suite`, sheetW / 2, sheetH - 30);
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
          prompt: settings.captionText || STYLES_INFO[settings.style].label,
          style: settings.style,
          shape: settings.shape,
        }),
      });
      const data = await res.json();
      if (data.text) {
        setAiDescription(data.text);
      } else {
        setAiDescription('Pegatina estilizada con troquelado die-cut de alta definición y acabado ' + FINISH_INFO[settings.finish].label);
      }
    } catch {
      setAiDescription('Pegatina profesional con contorno blanco vinílico y textura de alta calidad.');
    } finally {
      setAiGenerating(false);
    }
  };

  // 3D Tilt calculation
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 22, y: -y * 22 });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  const navTabs = [
    { id: 'single', label: 'Estudio 1-a-1', icon: <Wand2 className="w-4 h-4" /> },
    { id: 'sampler', label: 'Muestrario de Estilos', icon: <Grid className="w-4 h-4" /> },
    { id: 'sheet', label: 'Hoja de Impresión A4', icon: <Printer className="w-4 h-4" /> },
    { id: 'canvas', label: 'Lienzo Libre', icon: <Layers className="w-4 h-4" /> },
    { id: 'history', label: 'Historial', icon: <History className="w-4 h-4" /> },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#0b0c14] text-slate-100 selection:bg-indigo-600 selection:text-white font-sans antialiased overflow-hidden">
      {/* App Header */}
      <header className="h-14 shrink-0 border-b border-white/10 bg-[#10121d] px-4 sm:px-5 flex items-center justify-between gap-3 z-30 shadow-xs">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 shadow-sm shadow-indigo-500/25 flex items-center justify-center">
            <div className="w-full h-full bg-[#10121d] rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-indigo-400" />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-black tracking-wider text-white uppercase">
                HUB STICKERS PRO
              </h1>
              <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                2026 PRO
              </span>
            </div>
          </div>
        </div>

        {/* View Mode Navigation Tabs */}
        <nav className="hidden md:flex items-center bg-[#171928] p-1 rounded-xl border border-white/10 shadow-inner">
          {navTabs.map((tab) => {
            const isSelected = state.viewMode === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setState((prev) => ({ ...prev, viewMode: tab.id as any }))}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2">
          {/* AI Generator Trigger */}
          <button
            type="button"
            onClick={() => setIsAiModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold transition-all shadow-sm shadow-indigo-600/25 active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Generar con IA</span>
          </button>

          {/* Upload Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold border border-white/10 transition-all active:scale-95 cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Subir Foto</span>
          </button>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-400" />
            )}
          </button>

          {/* Quick Guide / Help */}
          <button
            type="button"
            onClick={() => setIsDocsModalOpen(true)}
            title="Guía y Atajos"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Viewport Container */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
          className="hidden"
        />

        {state.viewMode === 'single' && (
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
            {/* Google Flow Styled Left Control Sidebar */}
            <FlowSidebar
              settings={settings}
              setSettings={setSettings}
              saveSnapshot={saveSnapshot}
              aiSubjectPrompt={aiSubjectPrompt}
              setAiSubjectPrompt={setAiSubjectPrompt}
              viewMode={state.viewMode}
              setViewMode={(mode) => setState((prev) => ({ ...prev, viewMode: mode }))}
              onUndo={handleUndo}
              onRedo={handleRedo}
              canUndo={state.undoStack.length > 0}
              canRedo={state.redoStack.length > 0}
              onUploadClick={() => fileInputRef.current?.click()}
              onDownloadZip={handleDownloadZip}
              onGenerateSticker={handleGenerateMainSticker}
              isGenerating={isAiCreating || state.isLoading}
            />

            {/* Center Studio Live Viewport */}
            <section className="flex-1 flex flex-col items-center justify-between p-4 lg:p-6 bg-slate-100 dark:bg-[#0b0c12] relative overflow-hidden">
              {/* Stage Top Bar */}
              <div className="w-full max-w-4xl flex flex-wrap items-center justify-between gap-3 z-10">
                {/* Backdrop Switcher */}
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                    Fondo:
                  </span>
                  <div className="flex bg-white dark:bg-white/5 p-1 rounded-xl border border-slate-200 dark:border-white/10 shadow-xs">
                    {(['checker', 'dark', 'light', 'desk'] as const).map((bg) => (
                      <button
                        key={bg}
                        type="button"
                        onClick={() => setPreviewBg(bg)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                          previewBg === bg
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        {bg === 'checker' ? 'Damero' : bg === 'dark' ? 'Oscuro' : bg === 'light' ? 'Claro' : 'Madera'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Zoom Controls */}
                <div className="flex items-center gap-1.5 bg-white dark:bg-white/5 px-2 py-1 rounded-xl border border-slate-200 dark:border-white/10 shadow-xs">
                  <button
                    type="button"
                    onClick={() => setZoomLevel((prev) => Math.max(50, prev - 15))}
                    title="Alejar"
                    className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-bold w-12 text-center text-slate-700 dark:text-slate-300">
                    {zoomLevel}%
                  </span>
                  <button
                    type="button"
                    onClick={() => setZoomLevel((prev) => Math.min(180, prev + 15))}
                    title="Acercar"
                    className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setZoomLevel(100)}
                    title="Tamaño 100%"
                    className="px-1.5 py-0.5 text-[10px] font-black uppercase rounded bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                  >
                    100%
                  </button>
                </div>

                {/* Specs Badge */}
                <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[11px] font-bold text-slate-500 dark:text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>1024 × 1024 px • 300 DPI • PNG Alpha</span>
                </div>
              </div>

              {/* Main Interactive Sticker Stage */}
              <div
                className={`relative flex-1 w-full max-w-4xl min-h-[420px] my-3 rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-2xl flex items-center justify-center transition-all duration-300 ${
                  previewBg === 'checker'
                    ? 'checkerboard'
                    : previewBg === 'dark'
                    ? 'bg-[#0f1016]'
                    : previewBg === 'light'
                    ? 'bg-[#f8fafc]'
                    : 'bg-amber-950/20'
                }`}
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={handleMouseLeave}
              >
                {state.isLoading && (
                  <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm z-30 flex flex-col items-center justify-center gap-3 text-white">
                    <div className="w-10 h-10 border-3 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm font-extrabold">{state.status || 'Renderizando Pegatina...'}</p>
                  </div>
                )}

                {state.generatedSticker ? (
                  <div
                    className="relative transition-transform duration-100 ease-out select-none cursor-grab active:cursor-grabbing"
                    style={{
                      transform: `scale(${zoomLevel / 100}) perspective(900px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
                      transformStyle: 'preserve-3d',
                    }}
                  >
                    <img
                      src={state.generatedSticker}
                      alt="Pegatina Renderizada"
                      className={`max-w-[340px] md:max-w-[420px] max-h-[420px] object-contain select-none transition-all ${
                        settings.borderThickness > 1 ? 'drop-shadow-sticker-thick' : 'drop-shadow-sticker'
                      }`}
                      draggable={false}
                    />

                    {/* Realistic Holographic Sheen on hover */}
                    {isHovered && settings.finish === 'holographic-foil' && (
                      <div className="absolute inset-0 pointer-events-none rounded-3xl swatch-holographic opacity-20 mix-blend-color-dodge transition-opacity" />
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-slate-400">
                    <Sparkles className="w-10 h-10 animate-pulse text-indigo-400" />
                    <p className="text-sm font-bold">Generando vista previa...</p>
                  </div>
                )}

                {/* Floating HUD info */}
                <div className="absolute bottom-3 left-4 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 dark:bg-black/80 backdrop-blur-md text-white text-[11px] font-bold border border-white/10 shadow-lg">
                  <span className="text-indigo-400 font-black uppercase">
                    {STYLES_INFO[settings.style].label}
                  </span>
                  <span>•</span>
                  <span>{FINISH_INFO[settings.finish].label}</span>
                  <span>•</span>
                  <span>{settings.shape.toUpperCase()}</span>
                </div>
              </div>

              {/* Stage Bottom Action Bar */}
              <div className="w-full max-w-4xl flex flex-wrap items-center justify-between gap-3 z-10 pt-1">
                <div className="flex items-center gap-2">
                  <PillButton
                    variant="outline"
                    icon={<Layers className="w-4 h-4 text-indigo-500" />}
                    onClick={handleAddToCanvas}
                  >
                    Añadir al Lienzo Libre
                  </PillButton>

                  <PillButton
                    variant="outline"
                    icon={<Printer className="w-4 h-4 text-purple-500" />}
                    onClick={() => setState((prev) => ({ ...prev, viewMode: 'sheet' }))}
                  >
                    Crear Hoja A4
                  </PillButton>
                </div>

                <div className="flex items-center gap-2">
                  <PillButton
                    variant="outline"
                    icon={<Copy className="w-4 h-4" />}
                    onClick={handleCopyImage}
                  >
                    {copiedNotification ? '¡Copiado!' : 'Copiar'}
                  </PillButton>

                  <PillButton
                    variant="solid"
                    icon={<Download className="w-4 h-4" />}
                    onClick={handleDownloadSingle}
                    className="px-5 shadow-lg shadow-indigo-500/25"
                  >
                    Descargar PNG HD
                  </PillButton>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* 2. Sampler Matrix View (15 Styles) */}
        {state.viewMode === 'sampler' && (
          <div className="flex-1 p-4 lg:p-8 overflow-y-auto studio-scrollbar max-w-7xl mx-auto w-full">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  Muestrario de los 15 Estilos Artísticos
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Compara en tiempo real tu diseño en todos los estilos disponibles. Haz clic en cualquiera para cargarlo en el estudio.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <PillButton
                  variant="solid"
                  icon={<Wand2 className="w-4 h-4" />}
                  onClick={() => setState((prev) => ({ ...prev, viewMode: 'single' }))}
                >
                  Volver al Estudio 1-a-1
                </PillButton>
              </div>
            </div>

            {/* Grid of 15 Styles */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {(Object.keys(STYLES_INFO) as StickerStyle[]).map((styleKey) => {
                const info = STYLES_INFO[styleKey];
                const samplerUrl = state.samplerImages[styleKey];
                const isSelected = settings.style === styleKey;

                return (
                  <div
                    key={styleKey}
                    className={`flex flex-col p-3 rounded-2xl border transition-all ${
                      isSelected
                        ? 'bg-indigo-50/60 dark:bg-indigo-950/30 border-indigo-500 ring-2 ring-indigo-500/30 shadow-md'
                        : 'bg-white dark:bg-[#12131b] border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 shadow-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-5 h-5 rounded-md flex items-center justify-center text-xs"
                          style={{ backgroundColor: `${info.color}22`, color: info.color }}
                        >
                          {STYLE_ICONS[styleKey]}
                        </span>
                        <span className="text-xs font-black truncate text-slate-900 dark:text-white">
                          {info.label}
                        </span>
                      </div>
                      {isSelected && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-indigo-600 text-white">
                          ACTIVO
                        </span>
                      )}
                    </div>

                    <div className="aspect-square w-full rounded-xl checkerboard flex items-center justify-center p-3 mb-2 overflow-hidden bg-slate-100 dark:bg-[#181924]">
                      {samplerUrl ? (
                        <img
                          src={samplerUrl}
                          alt={info.label}
                          className="max-h-full max-w-full object-contain drop-shadow-sticker"
                        />
                      ) : (
                        <div className="flex items-center justify-center text-slate-400">
                          <RefreshCw className="w-5 h-5 animate-spin" />
                        </div>
                      )}
                    </div>

                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mb-3 line-clamp-2 h-7">
                      {info.desc}
                    </p>

                    <div className="flex items-center gap-1.5 mt-auto">
                      <button
                        type="button"
                        onClick={() => {
                          saveSnapshot();
                          setSettings((prev) => ({ ...prev, style: styleKey }));
                          setState((prev) => ({ ...prev, viewMode: 'single' }));
                        }}
                        className="flex-1 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-extrabold uppercase transition-all cursor-pointer"
                      >
                        Aplicar
                      </button>
                      {samplerUrl && (
                        <button
                          type="button"
                          onClick={() => {
                            const a = document.createElement('a');
                            a.href = samplerUrl;
                            a.download = `sticker-${styleKey}.png`;
                            a.click();
                          }}
                          title="Descargar este estilo"
                          className="p-1.5 rounded-lg bg-slate-100 dark:bg-white/10 hover:bg-slate-200 text-slate-700 dark:text-slate-200 cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. Sticker Sheet Print Generator */}
        {state.viewMode === 'sheet' && (
          <div className="flex-1 p-4 lg:p-8 overflow-y-auto studio-scrollbar max-w-6xl mx-auto w-full flex flex-col items-center">
            <div className="flex flex-wrap items-center justify-between w-full gap-4 mb-6">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  Hoja de Impresión A4 de Pegatinas
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Plantilla de alta densidad con guías de corte troquelado listas para papel adhesivo o vinilo.
                </p>
              </div>

              {/* Density Controls */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 bg-white dark:bg-white/5 p-1 rounded-xl border border-slate-200 dark:border-white/10">
                  <span className="text-[11px] font-bold text-slate-400 px-2">Densidad:</span>
                  {[4, 6, 9, 12, 16].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setSettings((prev) => ({ ...prev, sheetDensity: num }))}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        settings.sheetDensity === num
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {num}x
                    </button>
                  ))}
                </div>

                <PillButton
                  variant="solid"
                  icon={<Download className="w-4 h-4" />}
                  onClick={handleExportSheet}
                >
                  Descargar Hoja A4
                </PillButton>
              </div>
            </div>

            {/* Live Sheet Canvas Preview */}
            <div className="p-4 bg-slate-200 dark:bg-[#0c0d12] rounded-3xl border border-slate-300 dark:border-white/10 shadow-2xl flex items-center justify-center max-w-full overflow-hidden">
              <canvas
                ref={sheetCanvasRef}
                className="max-w-[460px] md:max-w-[560px] w-full h-auto rounded-xl shadow-2xl bg-white"
              />
            </div>
          </div>
        )}

        {/* 4. Canvas Editor View */}
        {state.viewMode === 'canvas' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <CanvasEditor
              items={state.canvasItems}
              onUpdateItems={(items) => setState((prev) => ({ ...prev, canvasItems: items }))}
              onExport={handleExportCanvas}
              exportState={exportState}
            />
          </div>
        )}

        {/* 5. History Gallery View */}
        {state.viewMode === 'history' && (
          <div className="flex-1 p-4 lg:p-8 overflow-y-auto studio-scrollbar max-w-6xl mx-auto w-full">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  Historial de Pegatinas Generadas
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Accede a todas las variantes y creaciones de esta sesión para descargarlas o reutilizarlas.
                </p>
              </div>
              {state.history.length > 0 && (
                <PillButton
                  variant="outline"
                  icon={<Trash2 className="w-3.5 h-3.5 text-rose-500" />}
                  onClick={() => setState((prev) => ({ ...prev, history: [] }))}
                >
                  Vaciar Historial
                </PillButton>
              )}
            </div>

            {state.history.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-slate-400 text-center">
                <History className="w-12 h-12 opacity-30 mb-2" />
                <p className="text-sm font-bold">Aún no hay creaciones en el historial.</p>
                <p className="text-xs mt-1">
                  Las pegatinas generadas en el estudio se guardarán automáticamente aquí.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {state.history.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col p-2.5 rounded-2xl bg-white dark:bg-[#12131a] border border-slate-200 dark:border-white/10 shadow-xs group"
                  >
                    <div className="aspect-square w-full rounded-xl checkerboard flex items-center justify-center p-2 mb-2 overflow-hidden">
                      {item.image && (
                        <img
                          src={item.image}
                          alt="Sticker History"
                          className="max-h-full max-w-full object-contain drop-shadow-sticker group-hover:scale-105 transition-transform"
                        />
                      )}
                    </div>
                    <div className="text-[10px] font-bold text-slate-600 dark:text-slate-400 truncate mb-2">
                      {STYLES_INFO[item.settings.style]?.label || item.settings.style} • {item.settings.shape}
                    </div>
                    <div className="flex items-center gap-1 mt-auto">
                      <button
                        type="button"
                        onClick={() => {
                          saveSnapshot();
                          setSettings(item.settings);
                          if (item.image) {
                            setState((prev) => ({
                              ...prev,
                              generatedSticker: item.image,
                              viewMode: 'single',
                            }));
                          }
                        }}
                        className="flex-1 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-extrabold uppercase transition-all cursor-pointer"
                      >
                        Restaurar
                      </button>
                      {item.image && (
                        <button
                          type="button"
                          onClick={() => {
                            const a = document.createElement('a');
                            a.href = item.image!;
                            a.download = `sticker-history-${item.id}.png`;
                            a.click();
                          }}
                          className="p-1 rounded-lg bg-slate-100 dark:bg-white/10 hover:bg-slate-200 text-slate-700 dark:text-slate-200 cursor-pointer"
                        >
                          <Download className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* AI Generator Modal / Flow Inpainting Studio */}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#12131d] w-full max-w-lg rounded-3xl border border-slate-200 dark:border-white/15 p-6 shadow-2xl flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    Generar Pegatina con IA
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Google Flow SDK • Nano Banana & Gemini Image Pipeline
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => !isAiCreating && setIsAiModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {/* Engine Selector in Modal */}
              <div className="flex flex-col gap-1.5 p-3 rounded-2xl bg-slate-900 text-white dark:bg-[#161824] border border-slate-700/80 dark:border-white/15">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    MOTOR DE INTELIGENCIA
                  </span>
                  <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30">
                    {AI_ENGINES_INFO[settings.aiEngine]?.badge}
                  </span>
                </div>
                <div className="relative flex items-center justify-between mt-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{AI_ENGINES_INFO[settings.aiEngine]?.icon}</span>
                    <div>
                      <p className="text-xs font-black text-white">{AI_ENGINES_INFO[settings.aiEngine]?.label}</p>
                      <p className="text-[10px] text-slate-400">{AI_ENGINES_INFO[settings.aiEngine]?.desc}</p>
                    </div>
                  </div>
                  <ChevronsUpDown className="w-4 h-4 text-slate-400 shrink-0" />
                  <select
                    value={settings.aiEngine}
                    onChange={(e) => setSettings((prev) => ({ ...prev, aiEngine: e.target.value as AiEngine }))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  >
                    {(Object.keys(AI_ENGINES_INFO) as AiEngine[]).map((engKey) => (
                      <option key={engKey} value={engKey} className="bg-slate-900 text-white">
                        {AI_ENGINES_INFO[engKey].icon} {AI_ENGINES_INFO[engKey].label} ({AI_ENGINES_INFO[engKey].badge})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Sujeto o Concepto del Sticker:
                </label>
                <textarea
                  value={aiSubjectPrompt}
                  onChange={(e) => setAiSubjectPrompt(e.target.value)}
                  placeholder="Ej. Dragón místico kawaii con destellos dorados, taza de café humeante pixel-art, robot cyberpunk con gafas de sol..."
                  rows={3}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/15 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
                />
              </div>

              {/* Reference Image Option */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-indigo-500" />
                  <div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Usar Imagen Actual como Referencia Visual
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                      Transforma o transfiere estilo manteniendo la silueta base
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={aiUseReference}
                  onChange={(e) => setAiUseReference(e.target.checked)}
                  className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                />
              </div>

              {/* Specs pill badges */}
              <div className="flex flex-wrap gap-2 text-[11px] font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-black/30 p-2.5 rounded-xl border border-slate-200 dark:border-white/5">
                <span>Estilo: <strong className="text-indigo-600 dark:text-indigo-400">{STYLES_INFO[settings.style].label}</strong></span>
                <span>•</span>
                <span>Acabado: <strong className="text-amber-600 dark:text-amber-400">{FINISH_INFO[settings.finish].label}</strong></span>
                <span>•</span>
                <span>Silueta: <strong className="text-purple-600 dark:text-purple-400">{settings.shape}</strong></span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-white/10">
              <button
                type="button"
                onClick={() => setIsAiModalOpen(false)}
                disabled={isAiCreating}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleGenerateAiSticker}
                disabled={isAiCreating || !aiSubjectPrompt.trim()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-black shadow-lg shadow-indigo-500/25 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isAiCreating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Creando con IA...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generar Pegatina</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Technical Documentation Modal */}
      {isDocsModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#12131d] w-full max-w-2xl max-h-[85vh] rounded-3xl border border-slate-200 dark:border-white/15 p-6 shadow-2xl flex flex-col gap-4 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <FileCode2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    Documentación Técnica • Hub Stickers Pro 2026
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Arquitectura del Sistema, Flow Tool SDK y Procesamiento Local
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsDocsModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto studio-scrollbar pr-2 flex flex-col gap-4 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
              <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-500/20">
                <h4 className="font-extrabold text-indigo-950 dark:text-indigo-200 mb-1">
                  1. Arquitectura y Entorno Sandbox
                </h4>
                <p>
                  Construido con React 19 + TypeScript y Tailwind CSS v4. Incorpora aceleración WebGL/WebGPU para segmentación de sujetos y modelos Gemini 3.7 / Nano Banana mediante proxy seguro de servidor.
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <h4 className="font-extrabold text-slate-900 dark:text-white">
                  2. Procesos Clave y Flujo de Datos
                </h4>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li><strong>Adquisición de Imagen:</strong> Selección de archivos locales (PNG/JPG/WebP/SVG) o generación de concepto mediante IA.</li>
                  <li><strong>Smart Cutout (Xenova/modnet):</strong> Segmentación de bordes por red neuronal para canal alfa transparente puro.</li>
                  <li><strong>Tight Crop (cropToContent):</strong> Bounding box automático de píxeles no transparentes para optimizar encuadre.</li>
                  <li><strong>Composición de Lienzo (Framer Motion):</strong> Manipulación con arrastre, rotación angular (-180° a +180°), escala y orden de capas (Z-index).</li>
                  <li><strong>Undo / Redo:</strong> Pila de snapshots en memoria de 20 niveles para revertir o rehacer cualquier ajuste.</li>
                </ul>
              </div>

              <div className="flex flex-col gap-2">
                <h4 className="font-extrabold text-slate-900 dark:text-white">
                  3. Integración con Flow SDK (Endpoints)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-[11px]">
                  <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold">Flow.media.select</span>
                    <p className="font-sans text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Selección y subida de imágenes</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold">Flow.generate.image</span>
                    <p className="font-sans text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Invocación de modelos generativos</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold">Flow.upload</span>
                    <p className="font-sans text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Registro temporal de imágenes de referencia</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold">Flow.download</span>
                    <p className="font-sans text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Exportación de pegatinas, hojas A4 y docs</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-white/10">
              <button
                type="button"
                onClick={handleDownloadDocs}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Descargar Docs (.MD)</span>
              </button>

              <button
                type="button"
                onClick={() => setIsDocsModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-200 cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
