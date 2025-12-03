export interface Mantra {
  id: string;
  name: string; // The text to chant
  totalLifetimeCounts: number; // Total beads clicked ever
  totalLifetimeMalas: number; // Total full 108 cycles ever
  todayCounts: number; // Reset at midnight
  todayMalas: number; // Reset at midnight
  currentStep: number; // 0 to 108
}

export interface AppState {
  mantras: Mantra[];
  selectedMantraId: string | null;
  language: 'en' | 'hi';
  soundEnabled: boolean;
  lastOpenedDate: string; // ISO Date string YYYY-MM-DD
}

export type Theme = 'orange' | 'white' | 'black';

export interface FloatingText {
  id: number;
  x: number;
  y: number;
  text: string;
}
