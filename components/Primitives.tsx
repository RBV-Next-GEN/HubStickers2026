import React, { useState, useRef, useEffect } from 'react';

export const SectionLabel: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color }) => (
  <div className="flex items-center px-2">
    <span className="text-[13px] font-bold tracking-[1.5px] uppercase" style={{ color: color || 'rgba(218,220,224,0.9)' }}>
      {children}
    </span>
  </div>
);

export const PillButton: React.FC<{
  icon?: React.ReactNode; 
  children: React.ReactNode;
  variant?: 'filled' | 'outline' | 'solid'; 
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  themeColor?: string;
}> = ({ icon, children, variant = 'filled', onClick, disabled = false, className = '', themeColor }) => {
  const base = 'flex items-center gap-[4px] justify-center w-full h-[36px] rounded-xl font-bold text-[13px] tracking-tight transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed uppercase';
  const customBg = themeColor || '#969696';
  const variants: Record<string, string> = {
    filled: "text-black pl-[8px] pr-[16px] py-1 select-none shadow-lg shadow-black/20",
    outline: 'border border-[#595959] hover:bg-white/5 active:bg-white/10 backdrop-blur-[40px] pl-[8px] pr-[16px] py-2 text-white select-none',
    solid: 'bg-white hover:bg-gray-200 active:bg-gray-300 text-black pl-[8px] pr-[16px] py-2 select-none',
  };
  return (
    <button type="button" className={`${base} ${variants[variant]} ${className}`} onClick={onClick} disabled={disabled} style={variant === 'filled' ? { backgroundColor: customBg } : {}}>
      {icon && <span className="flex items-center justify-center w-5 h-5">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};

export const FieldDropdown: React.FC<{
  label: string; 
  value: string; 
  options: string[];
  onChange: (val: string) => void; 
  className?: string;
  accentColor?: string;
  renderOption?: (opt: string) => React.ReactNode;
}> = ({ label, value, options, onChange, className = '', accentColor, renderOption }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) return;
      setIsOpen(false);
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => { 
      document.removeEventListener('mousedown', listener); 
      document.removeEventListener('touchstart', listener); 
    };
  }, [ref]);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button type="button" onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left border border-[#333] hover:border-[#555] bg-white/5 backdrop-blur-md transition-all rounded-xl flex flex-col gap-0.5 justify-center pb-2 pl-3 pr-2 pt-[6px] select-none focus:outline-none min-h-[52px]">
        <p className="text-[11px] font-bold text-white/30 uppercase tracking-widest">{label}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {renderOption ? renderOption(value) : <span className="text-[13px] font-bold text-white tracking-tight">{value}</span>}
          </div>
          <span className={`material-symbols-outlined text-[18px] transition-transform ${isOpen ? 'rotate-180' : ''}`} style={{ color: accentColor || 'rgba(218,220,224,0.5)' }}>
            unfold_more
          </span>
        </div>
      </button>
      {isOpen && (
        <div className="absolute z-50 top-[calc(100%+6px)] left-0 w-full bg-[#111] border border-[#333] rounded-2xl overflow-hidden shadow-2xl animate-dropdown origin-top">
          <div className="max-h-56 overflow-y-auto dark-scrollbar py-1">
            {options.map((opt) => (
              <button key={opt} type="button"
                className={`w-full text-left px-3 py-2.5 text-[13px] font-bold tracking-tight hover:bg-white/10 transition-colors flex items-center gap-2 ${value === opt ? 'bg-white/5 text-white' : 'text-white/50'}`}
                onClick={() => { onChange(opt); setIsOpen(false); }}>
                {renderOption ? renderOption(opt) : opt}
                {value === opt && <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor || '#fff' }} />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const SegmentedToggle: React.FC<{
  value: string; 
  items: { value: string; label: string; icon?: React.ReactNode }[];
  onChange: (val: string) => void;
  numCols?: number;
  accentColor?: string;
}> = ({ value, items, onChange, numCols, accentColor }) => {
  const isGrid = numCols && numCols > 0;
  return (
    <div className={`w-full border border-[#333] rounded-xl overflow-hidden bg-white/5 backdrop-blur-md ${isGrid ? 'grid p-1 gap-1' : 'flex items-center p-1 gap-1'}`} style={isGrid ? { gridTemplateColumns: `repeat(${numCols}, 1fr)` } : {}}>
      {items.map((item) => {
        const isActive = value === item.value;
        return (
          <button key={item.value} type="button" onClick={() => onChange(item.value)} style={isActive && accentColor ? { backgroundColor: accentColor } : {}}
            className={`flex-1 flex items-center justify-center gap-1.5 h-[34px] px-2 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer ${isActive ? (!accentColor ? 'bg-[#969696] text-black' : 'text-black') : 'text-white/40 hover:text-white/80 hover:bg-white/5'}`}>
            {item.icon}<span className="truncate">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export const TextInput: React.FC<{
  value: string; 
  onChange: (val: string) => void; 
  placeholder?: string;
  label?: string;
  accentColor?: string;
}> = ({ value, onChange, placeholder, label, accentColor }) => (
  <div className="flex flex-col gap-1.5 w-full">
    {label && <p className="text-[11px] font-bold text-white/30 uppercase tracking-widest pl-1">{label}</p>}
    <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
      className="border border-[#333] hover:border-[#444] focus:border-[#555] rounded-xl w-full h-[64px] px-3 py-3 resize-none bg-white/5 text-[13px] font-bold text-white placeholder-white/20 tracking-tight focus:outline-none transition-all" 
      style={value ? { borderColor: accentColor + '44' } : {}} />
  </div>
);