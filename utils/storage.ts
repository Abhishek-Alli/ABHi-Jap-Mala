import { AppState, Mantra } from '../types';

const STORAGE_KEY = 'abhi_jap_mala_v1';

const getTodayString = () => new Date().toISOString().split('T')[0];

const DEFAULT_STATE: AppState = {
  mantras: [],
  selectedMantraId: null,
  language: 'en',
  soundEnabled: true,
  lastOpenedDate: getTodayString(),
};

export const loadState = (): AppState => {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (!serialized) return DEFAULT_STATE;

    const state: AppState = JSON.parse(serialized);
    const today = getTodayString();

    // Check for daily reset (12:00 AM logic)
    if (state.lastOpenedDate !== today) {
      console.log("New day detected. Resetting daily counters.");
      const updatedMantras = state.mantras.map(m => ({
        ...m,
        todayCounts: 0,
        todayMalas: 0
        // We do NOT reset currentStep, user might be in middle of a mala
      }));
      
      return {
        ...state,
        mantras: updatedMantras,
        lastOpenedDate: today
      };
    }

    return state;
  } catch (e) {
    console.error("Failed to load state", e);
    return DEFAULT_STATE;
  }
};

export const saveState = (state: AppState) => {
  try {
    const stateToSave = { ...state, lastOpenedDate: getTodayString() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
  } catch (e) {
    console.error("Failed to save state", e);
  }
};