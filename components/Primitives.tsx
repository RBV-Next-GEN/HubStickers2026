import React, { useState, useRef, useEffect } from 'react';

export const SectionLabel: React.FC<{
  children: React.ReactNode;
  step?: string;
  badge?: string;
}> = ({ children, step, badge }) => (
  <div className="flex items-center justify-between px-1 mb-1">
    <div className="flex items-center gap-2">
      {step && (
        <span className="flex items-center justify-center w-5 h-5 rounded-md bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 font-black text-[11px]">
          {step}
        </span>
      )}
      <span className="text-[12px] font-extrabold tracking-wider uppercase text-slate-800 dark:text-slate-200">
        {children}
      </span>
    </div>
    {badge && (
      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/10">
        {badge}
      </span>
    )}
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
  const base = 'inline-flex items-center gap-2 justify-center h-[38px] rounded-xl font-bold text-xs tracking-wide transition-all cursor-pointer select-none disabled:opacity-40 disabled:cursor-not-allowed uppercase';

  const variants: Record<string, string> = {
    filled: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 active:scale-[0.98]',
    outline: 'border border-slate-200 dark:border-white/15 bg-white/70 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 active:scale-[0.98]',
    solid: 'bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 shadow-md active:scale-[0.98]',
  };

  return (
    <button
      type="button"
      className={`${base} ${variants[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      style={variant === 'filled' && themeColor ? { backgroundColor: themeColor } : {}}
    >
      {icon && <span className="flex items-center justify-center shrink-0">{icon}</span>}
      <span className="truncate">{children}</span>
    </button>
  );
};

export const FieldDropdown: React.FC<{
  label: string;
  value: string;
  options: string[];
  onChange: (val: string) => void;
  className?: string;
  renderOption?: (opt: string) => React.ReactNode;
}> = ({ label, value, options, onChange, className = '', renderOption }) => {
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
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left border border-slate-200 dark:border-white/10 hover:border-indigo-400 dark:hover:border-white/20 bg-white dark:bg-white/5 transition-all rounded-2xl flex flex-col justify-center px-3.5 py-2.5 select-none focus:outline-none shadow-xs min-h-[56px]"
      >
        <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-400 uppercase tracking-wider">
          {label}
        </span>
        <div className="flex items-center justify-between mt-0.5">
          <div className="flex items-center gap-2 overflow-hidden">
            {renderOption ? renderOption(value) : (
              <span className="text-xs font-bold text-slate-900 dark:text-white truncate">{value}</span>
            )}
          </div>
          <span className={`text-[12px] text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </div>
      </button>

      {isOpen && (
        <div className="absolute z-50 top-[calc(100%+6px)] left-0 w-full bg-white dark:bg-[#15161f] border border-slate-200 dark:border-white/15 rounded-2xl overflow-hidden shadow-2xl animate-dropdown origin-top">
          <div className="max-h-60 overflow-y-auto studio-scrollbar py-1">
            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                className={`w-full text-left px-3.5 py-2.5 text-xs font-bold transition-colors flex items-center justify-between ${
                  value === opt
                    ? 'bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10'
                }`}
                onClick={() => {
                  onChange(opt);
                  setIsOpen(false);
                }}
              >
                {renderOption ? renderOption(opt) : opt}
                {value === opt && <span className="text-indigo-600 dark:text-indigo-400 font-bold ml-2">✓</span>}
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
}> = ({ value, items, onChange, numCols }) => {
  const isGrid = numCols && numCols > 0;
  return (
    <div
      className={`w-full border border-slate-200 dark:border-white/10 rounded-2xl p-1 bg-slate-100/80 dark:bg-white/5 backdrop-blur-sm ${
        isGrid ? 'grid gap-1' : 'flex items-center gap-1'
      }`}
      style={isGrid ? { gridTemplateColumns: `repeat(${numCols}, 1fr)` } : {}}
    >
      {items.map((item) => {
        const isActive = value === item.value;
        return (
          <button
            key={item.value}
            type="button"
            onClick={() => onChange(item.value)}
            className={`flex-1 flex items-center justify-center gap-1.5 h-[34px] px-2.5 rounded-xl text-[11px] font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
              isActive
                ? 'bg-white dark:bg-indigo-600 text-indigo-700 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {item.icon && <span className="shrink-0">{item.icon}</span>}
            <span className="truncate">{item.label}</span>
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
}> = ({ value, onChange, placeholder, label }) => (
  <div className="flex flex-col gap-1 w-full">
    {label && (
      <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-400 uppercase tracking-wider pl-1">
        {label}
      </span>
    )}
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="border border-slate-200 dark:border-white/10 hover:border-indigo-400 dark:hover:border-white/20 focus:border-indigo-500 dark:focus:border-indigo-400 rounded-2xl w-full h-[62px] px-3.5 py-2.5 resize-none bg-white dark:bg-white/5 text-xs font-bold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none transition-all shadow-xs"
    />
  </div>
);
