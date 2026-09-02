import React from 'react';
import {
  Sparkles,
  Scissors,
  Image as ImageIcon,
  Square,
  Layers,
  ChevronsUpDown,
  Grid,
  History,
  Undo2,
  Redo2,
  FileCode2,
  RefreshCw,
  Sliders,
  Palette,
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
  Heart,
  Circle,
  ShieldCheck,
  Hexagon,
  Sun,
  Wand2,
  Crown
} from 'lucide-react';
import {
  StickerStyle,
  StickerShape,
  StickerPalette,
  StickerFinish,
  StickerSettings,
  AiEngine,
  CroppingMode
} from '../../types';
import {
  STYLES_INFO,
  SHAPES_INFO,
  FINISH_INFO,
  PALETTES_INFO,
  AI_ENGINES_INFO
} from '../../services/stickerStyler';

// Icon mapping for styles
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

interface FlowSidebarProps {
  settings: StickerSettings;
  setSettings: React.Dispatch<React.SetStateAction<StickerSettings>>;
  saveSnapshot: () => void;
  aiSubjectPrompt: string;
  setAiSubjectPrompt: (val: string) => void;
  viewMode: 'single' | 'sheet' | 'sampler' | 'canvas' | 'history';
  setViewMode: (mode: 'single' | 'sheet' | 'sampler' | 'canvas' | 'history') => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onUploadClick: () => void;
  onDownloadZip: () => void;
  onGenerateSticker: () => void;
  isGenerating: boolean;
}

export const FlowSidebar: React.FC<FlowSidebarProps> = ({
  settings,
  setSettings,
  saveSnapshot,
  aiSubjectPrompt,
  setAiSubjectPrompt,
  viewMode,
  setViewMode,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onUploadClick,
  onDownloadZip,
  onGenerateSticker,
  isGenerating
}) => {
  return (
    <aside className="w-full lg:w-[350px] xl:w-[370px] shrink-0 border-r border-white/10 bg-[#12131e] p-3.5 overflow-y-auto studio-scrollbar flex flex-col gap-3.5 max-h-[calc(100vh-56px)] select-none">
      {/* SUBIDA: Yellow Highlight Button */}
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 pl-1">
          SUBIDA
        </span>
        <button
          type="button"
          onClick={onUploadClick}
          className="w-full py-2.5 px-4 bg-[#ffd600] hover:bg-[#ffe033] text-black font-black text-xs uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 transition-all active:scale-[0.98] cursor-pointer"
        >
          <Sparkles className="w-4 h-4 fill-black text-black" />
          <span>SUBIR FOTO</span>
        </button>
      </div>

      {/* NAVEGACIÓN: 4 View Modes + Undo / Redo */}
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 pl-1">
          NAVEGACIÓN
        </span>
        <div className="grid grid-cols-2 gap-1.5">
          <button
            type="button"
            onClick={() => setViewMode('single')}
            className={`flex items-center justify-center gap-2 py-2 px-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              viewMode === 'single'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                : 'bg-[#181928] text-slate-300 hover:bg-[#222438] border border-white/5'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>INDIVIDUAL</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('sheet')}
            className={`flex items-center justify-center gap-2 py-2 px-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              viewMode === 'sheet'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                : 'bg-[#181928] text-slate-300 hover:bg-[#222438] border border-white/5'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>PLANILLA</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('sampler')}
            className={`flex items-center justify-center gap-2 py-2 px-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              viewMode === 'sampler'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                : 'bg-[#181928] text-slate-300 hover:bg-[#222438] border border-white/5'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>MUESTRAS</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('history')}
            className={`flex items-center justify-center gap-2 py-2 px-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              viewMode === 'history'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                : 'bg-[#181928] text-slate-300 hover:bg-[#222438] border border-white/5'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>HISTORIAL</span>
          </button>
        </div>

        {/* Undo / Redo */}
        <div className="grid grid-cols-2 gap-1.5 mt-0.5">
          <button
            type="button"
            onClick={onUndo}
            disabled={!canUndo}
            className="flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-[#181928] hover:bg-[#222438] text-slate-300 text-xs font-extrabold uppercase border border-white/5 disabled:opacity-30 cursor-pointer transition-all"
          >
            <Undo2 className="w-3.5 h-3.5" />
            <span>DESHACER</span>
          </button>
          <button
            type="button"
            onClick={onRedo}
            disabled={!canRedo}
            className="flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-[#181928] hover:bg-[#222438] text-slate-300 text-xs font-extrabold uppercase border border-white/5 disabled:opacity-30 cursor-pointer transition-all"
          >
            <Redo2 className="w-3.5 h-3.5" />
            <span>REHACER</span>
          </button>
        </div>
      </div>

      {/* FONDO & RECORTE: Recorte IA vs Completo / Opaco vs Transparente */}
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 pl-1">
          FONDO & RECORTE
        </span>
        <div className="grid grid-cols-2 gap-1.5">
          <button
            type="button"
            onClick={() => {
              saveSnapshot();
              setSettings((prev) => ({ ...prev, useSmartCutout: true }));
            }}
            className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              settings.useSmartCutout
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                : 'bg-[#181928] text-slate-300 hover:bg-[#222438] border border-white/5'
            }`}
          >
            <Scissors className="w-3.5 h-3.5" />
            <span>RECORTE IA</span>
          </button>
          <button
            type="button"
            onClick={() => {
              saveSnapshot();
              setSettings((prev) => ({ ...prev, useSmartCutout: false }));
            }}
            className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              !settings.useSmartCutout
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                : 'bg-[#181928] text-slate-300 hover:bg-[#222438] border border-white/5'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>COMPLETO</span>
          </button>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          <button
            type="button"
            onClick={() => {
              saveSnapshot();
              setSettings((prev) => ({ ...prev, backgroundColor: 'white' }));
            }}
            className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              settings.backgroundColor === 'white'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                : 'bg-[#181928] text-slate-300 hover:bg-[#222438] border border-white/5'
            }`}
          >
            <Square className="w-3.5 h-3.5 fill-current" />
            <span>OPACO (BLANCO)</span>
          </button>
          <button
            type="button"
            onClick={() => {
              saveSnapshot();
              setSettings((prev) => ({ ...prev, backgroundColor: 'transparent' }));
            }}
            className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              settings.backgroundColor !== 'white'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                : 'bg-[#181928] text-slate-300 hover:bg-[#222438] border border-white/5'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>TRANSPARENTE</span>
          </button>
        </div>
      </div>

      {/* CONFIGURACIÓN: Estilo Artístico, Encuadre, Paleta, Forma */}
      <div className="flex flex-col gap-2">
        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 pl-1">
          CONFIGURACIÓN
        </span>

        {/* ESTILO ARTÍSTICO */}
        <div className="relative group bg-[#181928] p-2.5 rounded-2xl border border-white/10 hover:border-white/20 transition-all">
          <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block mb-1">
            ESTILO ARTÍSTICO
          </span>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 truncate">
              <span className="text-sm">{STYLE_ICONS[settings.style]}</span>
              <span className="text-xs font-black text-white truncate">
                {STYLES_INFO[settings.style]?.label || 'Pop Art'}
              </span>
            </div>
            <ChevronsUpDown className="w-4 h-4 text-slate-400" />
          </div>
          <select
            value={settings.style}
            onChange={(e) => {
              saveSnapshot();
              setSettings((prev) => ({ ...prev, style: e.target.value as StickerStyle }));
            }}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          >
            {(Object.keys(STYLES_INFO) as StickerStyle[]).map((st) => (
              <option key={st} value={st} className="bg-slate-900 text-white">
                {STYLES_INFO[st].label} - {STYLES_INFO[st].desc}
              </option>
            ))}
          </select>
        </div>

        {/* ENCUADRE */}
        <div className="relative group bg-[#181928] p-2.5 rounded-2xl border border-white/10 hover:border-white/20 transition-all">
          <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block mb-1">
            ENCUADRE
          </span>
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-white">
              {settings.croppingMode === 'tight' ? 'Recorte Ajustado (Tight)' : '1:1 (Original)'}
            </span>
            <ChevronsUpDown className="w-4 h-4 text-slate-400" />
          </div>
          <select
            value={settings.croppingMode}
            onChange={(e) => {
              saveSnapshot();
              setSettings((prev) => ({ ...prev, croppingMode: e.target.value as CroppingMode }));
            }}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          >
            <option value="1:1" className="bg-slate-900 text-white">
              1:1 (Original)
            </option>
            <option value="tight" className="bg-slate-900 text-white">
              Recorte Ajustado (Tight)
            </option>
          </select>
        </div>

        {/* Row: PALETA & FORMA */}
        <div className="grid grid-cols-2 gap-2">
          <div className="relative group bg-[#181928] p-2.5 rounded-2xl border border-white/10 hover:border-white/20 transition-all">
            <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block mb-1">
              PALETA
            </span>
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-white truncate">
                {PALETTES_INFO[settings.palette]?.label || 'Original'}
              </span>
              <ChevronsUpDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </div>
            <select
              value={settings.palette}
              onChange={(e) => {
                saveSnapshot();
                setSettings((prev) => ({ ...prev, palette: e.target.value as StickerPalette }));
              }}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            >
              {(Object.keys(PALETTES_INFO) as StickerPalette[]).map((pal) => (
                <option key={pal} value={pal} className="bg-slate-900 text-white">
                  {PALETTES_INFO[pal].label}
                </option>
              ))}
            </select>
          </div>

          <div className="relative group bg-[#181928] p-2.5 rounded-2xl border border-white/10 hover:border-white/20 transition-all">
            <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block mb-1">
              FORMA
            </span>
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-white truncate">
                {SHAPES_INFO[settings.shape]?.label || 'Corte Personalizado'}
              </span>
              <ChevronsUpDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </div>
            <select
              value={settings.shape}
              onChange={(e) => {
                saveSnapshot();
                setSettings((prev) => ({ ...prev, shape: e.target.value as StickerShape }));
              }}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            >
              {(Object.keys(SHAPES_INFO) as StickerShape[]).map((sh) => (
                <option key={sh} value={sh} className="bg-slate-900 text-white">
                  {SHAPES_INFO[sh].label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* PERSONALIZACIÓN: Sujeto Prompt & Texto */}
      <div className="flex flex-col gap-2">
        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 pl-1">
          PERSONALIZACIÓN
        </span>
        <div>
          <span className="text-[10px] font-bold text-slate-300 block mb-1">
            ¿QUÉ ES EL SUJETO?
          </span>
          <input
            type="text"
            value={aiSubjectPrompt}
            onChange={(e) => setAiSubjectPrompt(e.target.value)}
            placeholder="ej. un gato astronauta"
            className="w-full bg-[#181928] border border-white/10 rounded-2xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-300 block mb-1">
            TEXTO EN PEGATINA
          </span>
          <input
            type="text"
            value={settings.captionText}
            onChange={(e) => setSettings((prev) => ({ ...prev, captionText: e.target.value }))}
            placeholder="ej. ¡Despegue!"
            className="w-full bg-[#181928] border border-white/10 rounded-2xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* FÍSICO: Acabado y Borde */}
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 pl-1">
          FÍSICO
        </span>
        <div className="grid grid-cols-2 gap-2">
          <div className="relative group bg-[#181928] p-2.5 rounded-2xl border border-white/10 hover:border-white/20 transition-all">
            <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block mb-1">
              ACABADO
            </span>
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-white truncate">
                {FINISH_INFO[settings.finish]?.label || 'Brillante'}
              </span>
              <ChevronsUpDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </div>
            <select
              value={settings.finish}
              onChange={(e) => {
                saveSnapshot();
                setSettings((prev) => ({ ...prev, finish: e.target.value as StickerFinish }));
              }}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            >
              {(Object.keys(FINISH_INFO) as StickerFinish[]).map((fn) => (
                <option key={fn} value={fn} className="bg-slate-900 text-white">
                  {FINISH_INFO[fn].label}
                </option>
              ))}
            </select>
          </div>

          <div className="relative group bg-[#181928] p-2.5 rounded-2xl border border-white/10 hover:border-white/20 transition-all">
            <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block mb-1">
              BORDE
            </span>
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-white truncate">
                {settings.borderThickness === 0
                  ? 'Sin Borde'
                  : settings.borderThickness === 2
                  ? 'Grueso'
                  : 'Estándar'}
              </span>
              <ChevronsUpDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </div>
            <select
              value={String(settings.borderThickness)}
              onChange={(e) => {
                saveSnapshot();
                setSettings((prev) => ({ ...prev, borderThickness: Number(e.target.value) as any }));
              }}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            >
              <option value="2" className="bg-slate-900 text-white">
                Grueso
              </option>
              <option value="1" className="bg-slate-900 text-white">
                Estándar
              </option>
              <option value="0" className="bg-slate-900 text-white">
                Sin Borde
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* INTELIGENCIA: Motor de Generación */}
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 pl-1">
          INTELIGENCIA
        </span>
        <div className="relative group bg-[#181928] p-2.5 rounded-2xl border border-white/10 hover:border-white/20 transition-all">
          <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block mb-1">
            MOTOR DE GENERACIÓN
          </span>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 truncate">
              <span className="text-sm">{AI_ENGINES_INFO[settings.aiEngine]?.icon || '🍌'}</span>
              <span className="text-xs font-black text-white truncate">
                {AI_ENGINES_INFO[settings.aiEngine]?.label || 'Nano Banana Pro'}
              </span>
            </div>
            <ChevronsUpDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          </div>
          <select
            value={settings.aiEngine}
            onChange={(e) => {
              saveSnapshot();
              setSettings((prev) => ({ ...prev, aiEngine: e.target.value as AiEngine }));
            }}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          >
            {(Object.keys(AI_ENGINES_INFO) as AiEngine[]).map((eng) => (
              <option key={eng} value={eng} className="bg-slate-900 text-white">
                {AI_ENGINES_INFO[eng].icon} {AI_ENGINES_INFO[eng].label} ({AI_ENGINES_INFO[eng].badge})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* PROYECTO: Descargar ZIP */}
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 pl-1">
          PROYECTO
        </span>
        <button
          type="button"
          onClick={onDownloadZip}
          className="w-full py-2.5 px-3 bg-[#181928] hover:bg-[#222438] text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 border border-white/10 cursor-pointer transition-all"
        >
          <FileCode2 className="w-4 h-4 text-slate-300" />
          <span>DESCARGAR CÓDIGO ZIP</span>
        </button>
      </div>

      {/* BOTÓN DE GENERAR PEGATINA - EL MÁS IMPORTANTE */}
      <div className="pt-2 sticky bottom-0 bg-[#12131e]/95 backdrop-blur-md pb-1 z-20">
        <button
          type="button"
          onClick={onGenerateSticker}
          disabled={isGenerating}
          className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-500 hover:from-emerald-500 hover:to-green-500 text-white font-black text-sm uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-green-600/30 border border-green-400/30 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-white" />
              <span>GENERANDO PEGATINA...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-white fill-white" />
              <span>GENERAR PEGATINA</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
};
