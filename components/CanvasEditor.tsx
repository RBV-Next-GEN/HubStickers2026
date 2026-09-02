import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Trash2, Download, RotateCw, ZoomIn, ZoomOut, Layers, Sparkles } from 'lucide-react';
import { CanvasItem } from '../types';
import { PillButton } from './Primitives';

interface CanvasEditorProps {
  items: CanvasItem[];
  onUpdateItems: (items: CanvasItem[]) => void;
  onExport: () => void;
  exportState: 'idle' | 'busy' | 'done' | 'error';
}

export const CanvasEditor: React.FC<CanvasEditorProps> = ({
  items,
  onUpdateItems,
  onExport,
  exportState,
}) => {
  const [canvasBg, setCanvasBg] = useState<'dark' | 'light' | 'checker'>('checker');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const updateItem = (id: string, delta: Partial<CanvasItem>) => {
    onUpdateItems(items.map((item) => (item.id === id ? { ...item, ...delta } : item)));
  };

  const removeItem = (id: string) => {
    onUpdateItems(items.filter((item) => item.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const bringToFront = (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    onUpdateItems([...items.filter((i) => i.id !== id), item]);
  };

  const rotateItem = (id: string, angleDelta: number) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    updateItem(id, { rotation: (item.rotation + angleDelta + 360) % 360 });
  };

  const scaleItem = (id: string, factor: number) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    updateItem(id, { scale: Math.max(0.3, Math.min(2.5, item.scale * factor)) });
  };

  const bgLabels = {
    checker: 'Damero Transparente',
    dark: 'Fondo Estudio Oscuro',
    light: 'Fondo Estudio Blanco',
  };

  const selectedItem = items.find((i) => i.id === selectedId);

  return (
    <div className="flex flex-col items-center gap-4 w-full h-full max-w-5xl mx-auto p-4">
      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between w-full gap-3 px-2">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
            Fondo del Lienzo:
          </span>
          <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-xl border border-slate-200 dark:border-white/10">
            {(['checker', 'dark', 'light'] as const).map((bg) => (
              <button
                key={bg}
                type="button"
                onClick={() => setCanvasBg(bg)}
                className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all ${
                  canvasBg === bg
                    ? 'bg-white dark:bg-indigo-600 text-indigo-700 dark:text-white shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                {bg === 'checker' ? 'Transparente' : bg === 'dark' ? 'Oscuro' : 'Blanco'}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {items.length > 0 && (
            <PillButton
              variant="outline"
              icon={<Trash2 className="w-3.5 h-3.5" />}
              onClick={() => onUpdateItems([])}
              className="px-3"
            >
              Limpiar
            </PillButton>
          )}

          <PillButton
            variant="solid"
            icon={<Download className="w-4 h-4" />}
            onClick={onExport}
            disabled={exportState !== 'idle' || items.length === 0}
            className="px-5 shadow-lg shadow-indigo-500/20"
          >
            {exportState === 'busy' ? 'Generando PNG...' : exportState === 'done' ? '✓ Descargado' : 'Exportar Lienzo HD'}
          </PillButton>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div
        ref={containerRef}
        className={`relative flex-1 w-full min-h-[460px] aspect-square rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-2xl transition-all duration-300 ${
          canvasBg === 'checker'
            ? 'checkerboard'
            : canvasBg === 'dark'
            ? 'bg-[#0f1016]'
            : 'bg-white'
        }`}
      >
        {items.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-slate-400 dark:text-slate-500 select-none p-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
              <Layers className="w-8 h-8 opacity-70" />
            </div>
            <p className="text-base font-bold text-slate-700 dark:text-slate-300">Lienzo Vacío</p>
            <p className="text-xs max-w-sm">
              Crea pegatinas en el estudio y pulsa <strong>"Añadir al Lienzo"</strong> para combinarlas, rotarlas y crear composiciones libres.
            </p>
          </div>
        ) : (
          items.map((item) => {
            const isSelected = selectedId === item.id;
            return (
              <motion.div
                key={item.id}
                drag
                dragConstraints={containerRef}
                dragMomentum={false}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedId(item.id);
                }}
                className={`absolute cursor-grab active:cursor-grabbing p-1 touch-none ${
                  isSelected ? 'ring-2 ring-indigo-500 rounded-2xl shadow-xl' : ''
                }`}
                style={{
                  left: item.x,
                  top: item.y,
                  rotate: item.rotation,
                  scale: item.scale,
                }}
              >
                <img
                  src={item.url}
                  alt="Sticker Layer"
                  className="w-36 h-36 object-contain pointer-events-none drop-shadow-sticker select-none"
                  draggable={false}
                />
              </motion.div>
            );
          })
        )}

        {/* Selected Layer Toolbar */}
        {selectedItem && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 p-1.5 bg-slate-900/90 dark:bg-black/90 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl text-white z-20">
            <button
              type="button"
              title="Girar a la izquierda (-15°)"
              onClick={() => rotateItem(selectedItem.id, -15)}
              className="p-2 hover:bg-white/20 rounded-xl transition-all"
            >
              <RotateCw className="w-4 h-4 -scale-x-100" />
            </button>
            <button
              type="button"
              title="Girar a la derecha (+15°)"
              onClick={() => rotateItem(selectedItem.id, 15)}
              className="p-2 hover:bg-white/20 rounded-xl transition-all"
            >
              <RotateCw className="w-4 h-4" />
            </button>
            <div className="w-px h-5 bg-white/20 mx-1" />
            <button
              type="button"
              title="Reducir tamaño"
              onClick={() => scaleItem(selectedItem.id, 0.85)}
              className="p-2 hover:bg-white/20 rounded-xl transition-all"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              type="button"
              title="Aumentar tamaño"
              onClick={() => scaleItem(selectedItem.id, 1.15)}
              className="p-2 hover:bg-white/20 rounded-xl transition-all"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <div className="w-px h-5 bg-white/20 mx-1" />
            <button
              type="button"
              title="Traer al frente"
              onClick={() => bringToFront(selectedItem.id)}
              className="p-2 hover:bg-white/20 rounded-xl transition-all text-xs font-bold flex items-center gap-1"
            >
              <Layers className="w-3.5 h-3.5" /> Frente
            </button>
            <button
              type="button"
              title="Eliminar capa"
              onClick={() => removeItem(selectedItem.id)}
              className="p-2 hover:bg-rose-500/30 text-rose-400 rounded-xl transition-all"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {items.length > 0 && (
        <div className="flex items-center justify-between w-full px-2 text-xs text-slate-400">
          <span>{items.length} {items.length === 1 ? 'capa activa' : 'capas activas'} • Arrastra para mover</span>
          <span>Haz clic en un sticker para rotarlo, escalarlo o cambiar orden</span>
        </div>
      )}
    </div>
  );
};
