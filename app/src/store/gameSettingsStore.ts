import { create } from "zustand";

interface GameSettings {
  roundTimeLimit: number;
  initialCoins: string;
  fastMode: boolean;
  elimsPerRound: number;
}

interface GameSettingsStore {
  gameSettings: GameSettings;
  updateRoundTimeLimit: (roundTimeLimit: number) => void;
  updateInitialCoins: (amount: string) => void;
  updateFastMode: (enabled: boolean) => void;
  updateElimsPerRound: (count: number) => void;
}

export const useGameSettingsStore = create<GameSettingsStore>((set) => ({
  gameSettings: {
    roundTimeLimit: 30,
    initialCoins: "medium",
    fastMode: false,
    elimsPerRound: 1,
  },
  updateRoundTimeLimit: (roundTimeLimit) =>
    set((state) => ({
      gameSettings: { ...state.gameSettings, roundTimeLimit },
    })),
  updateInitialCoins: (initialCoins) =>
    set((state) => ({
      gameSettings: { ...state.gameSettings, initialCoins },
    })),
  updateFastMode: (fastMode) =>
    set((state) => ({
      gameSettings: { ...state.gameSettings, fastMode },
    })),
  updateElimsPerRound: (elimsPerRound) =>
    set((state) => ({
      gameSettings: { ...state.gameSettings, elimsPerRound },
    })),
}));
