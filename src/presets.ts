export interface PresetSticker {
  id: string;
  name: string;
  category: string;
  dataUrl: string;
  defaultStyle: string;
  defaultShape: string;
}

// Generates high quality SVG data URLs for instant presets
function createSvgDataUrl(svgContent: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgContent)}`;
}

export const PRESET_STICKERS: PresetSticker[] = [
  {
    id: 'cyber-cat',
    name: 'Cyberpunk Cat',
    category: 'Mascotas / Cyber',
    defaultStyle: 'cyberpunk',
    defaultShape: 'die-cut',
    dataUrl: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
        <defs>
          <linearGradient id="cyberGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#ec4899" />
            <stop offset="100%" stop-color="#06b6d4" />
          </linearGradient>
          <linearGradient id="neonGlow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#00f0ff" />
            <stop offset="100%" stop-color="#ff007f" />
          </linearGradient>
        </defs>
        <circle cx="200" cy="200" r="170" fill="url(#cyberGrad)" opacity="0.15" />
        <!-- Cat Ears -->
        <polygon points="120,180 80,70 180,130" fill="#1e1b4b" stroke="#ec4899" stroke-width="8" stroke-linejoin="round" />
        <polygon points="115,160 90,90 160,130" fill="#f43f5e" />
        <polygon points="280,180 320,70 220,130" fill="#1e1b4b" stroke="#06b6d4" stroke-width="8" stroke-linejoin="round" />
        <polygon points="285,160 310,90 240,130" fill="#06b6d4" />
        <!-- Head -->
        <circle cx="200" cy="220" r="110" fill="#0f172a" stroke="#ffffff" stroke-width="8" />
        <!-- Cyber Visor -->
        <path d="M110,185 Q200,165 290,185 L280,225 Q200,245 120,225 Z" fill="#06b6d4" opacity="0.9" stroke="#ffffff" stroke-width="6" />
        <rect x="130" y="195" width="40" height="15" rx="4" fill="#ffffff" />
        <rect x="230" y="195" width="40" height="15" rx="4" fill="#ffffff" />
        <line x1="170" y1="202" x2="230" y2="202" stroke="#ff007f" stroke-width="4" stroke-dasharray="4,4" />
        <!-- Nose and Mouth -->
        <polygon points="200,250 190,240 210,240" fill="#ec4899" />
        <path d="M190,255 Q200,265 200,255 Q200,265 210,255" fill="none" stroke="#ffffff" stroke-width="5" stroke-linecap="round" />
        <!-- Whiskers -->
        <line x1="100" y1="240" x2="40" y2="230" stroke="#00f0ff" stroke-width="6" stroke-linecap="round" />
        <line x1="100" y1="255" x2="45" y2="260" stroke="#00f0ff" stroke-width="6" stroke-linecap="round" />
        <line x1="300" y1="240" x2="360" y2="230" stroke="#ff007f" stroke-width="6" stroke-linecap="round" />
        <line x1="300" y1="255" x2="355" y2="260" stroke="#ff007f" stroke-width="6" stroke-linecap="round" />
      </svg>
    `)
  },
  {
    id: 'space-astronaut',
    name: 'Astro Explorer',
    category: 'Espacio / Aventura',
    defaultStyle: 'pop-art',
    defaultShape: 'die-cut',
    dataUrl: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
        <defs>
          <linearGradient id="goldVisor" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#fbbf24" />
            <stop offset="50%" stop-color="#f59e0b" />
            <stop offset="100%" stop-color="#d97706" />
          </linearGradient>
        </defs>
        <!-- Helmet Outer -->
        <circle cx="200" cy="190" r="120" fill="#f8fafc" stroke="#0f172a" stroke-width="12" />
        <!-- Visor -->
        <ellipse cx="200" cy="190" rx="90" ry="70" fill="url(#goldVisor)" stroke="#0f172a" stroke-width="10" />
        <!-- Visor Reflection -->
        <path d="M150,150 Q180,135 220,140 Q180,160 150,150 Z" fill="#ffffff" opacity="0.8" />
        <circle cx="250" cy="210" r="10" fill="#ffffff" opacity="0.6" />
        <!-- Suit Collar -->
        <path d="M120,285 Q200,320 280,285 L310,380 L90,380 Z" fill="#e2e8f0" stroke="#0f172a" stroke-width="12" stroke-linejoin="round" />
        <!-- Chest Badges -->
        <rect x="160" y="320" width="80" height="24" rx="6" fill="#ef4444" stroke="#0f172a" stroke-width="4" />
        <circle cx="140" cy="332" r="8" fill="#3b82f6" stroke="#0f172a" stroke-width="3" />
        <circle cx="260" cy="332" r="8" fill="#10b981" stroke="#0f172a" stroke-width="3" />
      </svg>
    `)
  },
  {
    id: 'kawaii-boba',
    name: 'Kawaii Boba Tea',
    category: 'Kawaii / Comida',
    defaultStyle: 'kawaii',
    defaultShape: 'die-cut',
    dataUrl: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
        <!-- Straw -->
        <rect x="210" y="30" width="28" height="180" rx="10" fill="#f43f5e" stroke="#0f172a" stroke-width="8" transform="rotate(12 210 30)" />
        <!-- Cup -->
        <path d="M110,130 L130,340 Q135,365 170,365 L230,365 Q265,365 270,340 L290,130 Z" fill="#fed7aa" stroke="#0f172a" stroke-width="10" stroke-linejoin="round" />
        <!-- Milk Tea Liquid -->
        <path d="M118,170 L132,335 Q135,355 170,355 L230,355 Q265,355 268,335 L282,170 Q200,185 118,170 Z" fill="#fb923c" />
        <!-- Cup Lid -->
        <ellipse cx="200" cy="130" rx="95" ry="25" fill="#fbcfe8" stroke="#0f172a" stroke-width="10" />
        <!-- Tapioca Pearls -->
        <circle cx="160" cy="320" r="16" fill="#18181b" />
        <circle cx="200" cy="330" r="16" fill="#18181b" />
        <circle cx="240" cy="315" r="16" fill="#18181b" />
        <circle cx="180" cy="285" r="15" fill="#18181b" />
        <circle cx="220" cy="280" r="15" fill="#18181b" />
        <!-- Kawaii Face -->
        <circle cx="165" cy="225" r="9" fill="#0f172a" />
        <circle cx="168" cy="222" r="3" fill="#ffffff" />
        <circle cx="235" cy="225" r="9" fill="#0f172a" />
        <circle cx="238" cy="222" r="3" fill="#ffffff" />
        <path d="M192,235 Q200,245 208,235" fill="none" stroke="#0f172a" stroke-width="5" stroke-linecap="round" />
        <!-- Cheeks -->
        <ellipse cx="145" cy="235" rx="10" ry="6" fill="#f43f5e" opacity="0.6" />
        <ellipse cx="255" cy="235" rx="10" ry="6" fill="#f43f5e" opacity="0.6" />
      </svg>
    `)
  },
  {
    id: 'retro-arcade',
    name: 'Retro Arcade Pad',
    category: 'Gaming / 80s',
    defaultStyle: 'retro-vinyl',
    defaultShape: 'die-cut',
    dataUrl: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
        <!-- Controller Body -->
        <rect x="60" y="120" width="280" height="170" rx="30" fill="#334155" stroke="#0f172a" stroke-width="12" />
        <rect x="80" y="140" width="240" height="130" rx="20" fill="#64748b" />
        <!-- D-Pad -->
        <path d="M130,175 H150 V195 H170 V215 H150 V235 H130 V215 H110 V195 H130 Z" fill="#0f172a" stroke="#1e293b" stroke-width="4" stroke-linejoin="round" />
        <!-- Action Buttons -->
        <circle cx="250" cy="215" r="16" fill="#ef4444" stroke="#0f172a" stroke-width="4" />
        <circle cx="285" cy="185" r="16" fill="#3b82f6" stroke="#0f172a" stroke-width="4" />
        <circle cx="220" cy="185" r="16" fill="#eab308" stroke="#0f172a" stroke-width="4" />
        <circle cx="255" cy="155" r="16" fill="#22c55e" stroke="#0f172a" stroke-width="4" />
        <!-- Center buttons -->
        <rect x="180" y="240" width="16" height="8" rx="4" fill="#0f172a" />
        <rect x="204" y="240" width="16" height="8" rx="4" fill="#0f172a" />
      </svg>
    `)
  }
];
