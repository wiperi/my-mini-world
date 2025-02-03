import { create } from 'zustand';

interface AppState {
  isExpanded: boolean;
  setIsExpanded: (isExpanded: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isExpanded: false,
  setIsExpanded: (isExpanded: boolean) => set({ isExpanded }),
})); 