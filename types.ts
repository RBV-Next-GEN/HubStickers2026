export type StickerStyle = 
  | 'minimalist' 
  | 'pop-art' 
  | 'kawaii' 
  | 'retro-vinyl' 
  | 'cyberpunk'
  | 'holographic'
  | 'vaporwave'
  | '3d-render'
  | 'ink-sketch'
  | 'pixel-art'
  | 'watercolor'
  | 'embroidery'
  | 'graffiti'
  | 'origami'
  | 'clear-vinyl';

export type StickerShape = 'die-cut' | 'circle' | 'square' | 'badge' | 'heart' | 'hexagon';
export type StickerPalette = 'default' | 'vibrant' | 'pastel' | 'neon' | 'vintage' | 'noir' | 'earthy';
export type StickerFinish = 'glossy' | 'matte' | 'glitter' | 'holographic-foil' | 'metallic';
export type CroppingMode = '1:1' | 'tight';
export type AiEngine = 'nano-banana-pro' | 'nano-banana-turbo' | 'gemini-3.7-pro' | 'flow-vector' | 'modnet-local';

export interface CanvasItem {
  id: string;
  url: string;
  x: number;
  y: number;
  rotation: number;
  scale: number;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  image: string | null;
  settings: StickerSettings;
}

export interface StickerState {
  originalImage: string | null;
  originalMime: string | null;
  cutoutImage: string | null;
  cutoutMediaId: string | null;
  generatedSticker: string | null;
  samplerImages: Partial<Record<StickerStyle, string>>;
  failedSamplerStyles: StickerStyle[];
  selectedSamplerStyles: StickerStyle[];
  canvasItems: CanvasItem[];
  history: HistoryItem[]; 
  undoStack: HistoryItem[];
  redoStack: HistoryItem[];
  viewMode: 'single' | 'sheet' | 'sampler' | 'canvas' | 'history';
  isLoading: boolean;
  status: string;
  error: string | null;
}

export interface StickerSettings {
  aiEngine: AiEngine;
  style: StickerStyle;
  shape: StickerShape;
  palette: StickerPalette;
  finish: StickerFinish;
  borderThickness: 0 | 1 | 2;
  backgroundColor: 'white' | 'none' | 'transparent';
  customSubject: string;
  useSmartCutout: boolean;
  styleGuidance: string;
  captionText: string;
  model: string;
  sheetDensity: number;
  croppingMode: CroppingMode;
}