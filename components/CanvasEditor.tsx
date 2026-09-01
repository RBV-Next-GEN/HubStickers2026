import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { CanvasItem } from '../types';
import { PillButton } from './Primitives';

interface CanvasEditorProps {
  items: CanvasItem[];
  onUpdateItems: (items: CanvasItem[]) => void;
  onExport: () => void;
  exportState: 'idle' | 'busy' | 'done' | 'error';
}

export const CanvasEditor: React.FC<CanvasEditorProps> = ({ items, onUpdateItems, onExport, exportState }) => {
  const [canvasBg, setCanvasBg] = useState<'dark' | 'light' | 'checker'>('checker');
  const containerRef = useRef<HTMLDivElement>(null);

  const updateItem = (id: string, delta: Partial<CanvasItem>) => {
    onUpdateItems(items.map(item => item.id === id ? { ...item, ...delta } : item));
  };

  const removeItem = (id: string) => {
    onUpdateItems(items.filter(item => item.id !== id));
  };

  const bringToFront = (id: string) => {
    const item = items.find(i => i.id === id);
    if (!item) return;
    onUpdateItems([...items.filter(i => i.id !== id), item]);
  };

  const bgLabels = { checker: 'Cuadros', dark: 'Oscuro', light: 'Claro' };

  return (
    <div className="flex flex-col items-center gap-6 w-full h-full p-4">
      <div className="flex items-center justify-between w-full max-w-4xl px-4">
        <div className="flex items-center gap-4">
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
            {(['checker', 'dark', 'light'] as const).map(bg => (
              <button
                key={bg}
                type="button"
                onClick={() => setCanvasBg(bg)}
                className={`px-3 py-1.5 rounded-lg text-[12px] font-bold uppercase tracking-widest transition-all ${
                  canvasBg === bg ? 'bg-white/15 text-white shadow-sm' : 'text-white/40 hover:text-white/70'
                }`}
              >
                {bgLabels[bg]}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <PillButton
            variant="outline"
            icon={<span className="material-symbols-outlined text-[18px]">delete</span>}
            onClick={() => onUpdateItems([])}
            className="w-auto px-4"
          >
            Limpiar
          </PillButton>
          <PillButton
            variant="solid"
            icon={<span className="material-symbols-outlined text-[18px]">download</span>}
            onClick={onExport}
            disabled={exportState !== 'idle' || items.length === 0}
            className="w-auto px-6"
          >
            {exportState === 'busy' ? 'Exportando...' : exportState === 'done' ? '✓ Listo' : 'Exportar Lienzo'}
          </PillButton>
        </div>
      </div>

      <div
        ref={containerRef}
        className={`relative flex-1 w-full max-w-4xl min-h-[500px] aspect-square rounded-[32px] overflow-hidden border border-white/10 shadow-2xl transition-all duration-300 ${
          canvasBg === 'checker' ? 'checkerboard' : canvasBg === 'dark' ? 'bg-[#121318]' : 'bg-[#f8fafc]'
        }`}
      >
        {items.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-white/20 select-none">
            <span className="material-symbols-outlined text-[96px]">layers</span>
            <p className="uppercase font-extrabold tracking-[6px] text-sm">Lienzo Vacío</p>
            <p className="text-[12px] uppercase tracking-[2px] opacity-60">Añade pegatinas desde la vista Individual</p>
          </div>
        ) : (
          items.map((item) => (
            <motion.div
              key={item.id}
              drag
              dragMomentum={false}
              dragConstraints={containerRef}
              onDragStart={() => bringToFront(item.id)}
              style={{
                x: item.x,
                y: item.y,
                rotate: item.rotation,
                scale: item.scale,
                width: 200,
                height: 200
              }}
              onDragEnd={(_e, info) => {
                updateItem(item.id, { x: item.x + info.offset.x, y: item.y + info.offset.y });
              }}
              className="absolute cursor-grab active:cursor-grabbing group p-0 z-10"
            >
              <div className="relative w-full h-full">
                <img
                  src={item.url}
                  className="w-full h-full object-contain drop-shadow-sticker select-none pointer-events-none"
                  alt="Pegatina en Lienzo"
                />
                <div className="absolute -top-3 -right-3 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                  <button
                    type="button"
                    title="Eliminar"
                    onClick={(e) => { e.stopPropagation(); removeItem(item.id); }}
                    className="w-7 h-7 rounded-full bg-red-500/90 text-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform"
                  >
                    <span className="material-symbols-outlined text-[16px]">close</span>
                  </button>
                  <button
                    type="button"
                    title="Rotar +15°"
                    onClick={(e) => { e.stopPropagation(); updateItem(item.id, { rotation: item.rotation + 15 }); }}
                    className="w-7 h-7 rounded-full bg-neutral-900 border border-white/20 text-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform"
                  >
                    <span className="material-symbols-outlined text-[16px]">rotate_right</span>
                  </button>
                  <button
                    type="button"
                    title="Aumentar tamaño"
                    onClick={(e) => { e.stopPropagation(); updateItem(item.id, { scale: Math.min(2.5, item.scale + 0.1) }); }}
                    className="w-7 h-7 rounded-full bg-neutral-900 border border-white/20 text-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform"
                  >
                    <span className="material-symbols-outlined text-[16px]">zoom_in</span>
                  </button>
                  <button
                    type="button"
                    title="Reducir tamaño"
                    onClick={(e) => { e.stopPropagation(); updateItem(item.id, { scale: Math.max(0.4, item.scale - 0.1) }); }}
                    className="w-7 h-7 rounded-full bg-neutral-900 border border-white/20 text-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform"
                  >
                    <span className="material-symbols-outlined text-[16px]">zoom_out</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};
