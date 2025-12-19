import { create } from "zustand";

interface SoundStore {
  masterVolume: number;
  musicVolume: number;
  effectsVolume: number;
  setMasterVolume: (volume: number) => void;
  setMusicVolume: (volume: number) => void;
  setEffectsVolume: (volume: number) => void;
  getCalculatedMusicVolume: () => number;
  getCalculatedEffectsVolume: () => number;
}

export const useSoundStore = create<SoundStore>((set, get) => ({
  masterVolume: 0.5,
  musicVolume: 0,
  effectsVolume: 1,
  setMasterVolume: (volume: number) => set({ masterVolume: volume }),
  setMusicVolume: (volume: number) => set({ musicVolume: volume }),
  setEffectsVolume: (volume: number) => set({ effectsVolume: volume }),

  getCalculatedMusicVolume: () => {
    const { masterVolume, musicVolume } = get();
    return masterVolume * musicVolume;
  },
  getCalculatedEffectsVolume: () => {
    const { masterVolume, effectsVolume } = get();
    return masterVolume * effectsVolume;
  },
}));
