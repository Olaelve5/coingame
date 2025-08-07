import { create } from 'zustand';

interface GameSettings {
  timeLimit: number;
  coinAmount: string;
  fastMode: boolean;
  elimsPerRound: number;
}

interface GameSettingsStore {
  settings: GameSettings;
  updateTimeLimit: (timeLimit: number) => void;
  updateCoinAmount: (amount: string) => void;
  updateFastMode: (enabled: boolean) => void;
  updateElimsPerRound: (count: number) => void;
}

export const useGameSettingsStore = create<GameSettingsStore>((set) => ({
  settings: {
    timeLimit: 40,
    coinAmount: 'medium',
    fastMode: false,
    elimsPerRound: 2,
  },
  updateTimeLimit: (timeLimit) =>
    set((state) => ({
      settings: { ...state.settings, timeLimit }
    })),
  updateCoinAmount: (coinAmount) =>
    set((state) => ({
      settings: { ...state.settings, coinAmount }
    })),
  updateFastMode: (fastMode) =>
    set((state) => ({
      settings: { ...state.settings, fastMode }
    })),
  updateElimsPerRound: (elimsPerRound) =>
    set((state) => ({
      settings: { ...state.settings, elimsPerRound }
    })),
}));