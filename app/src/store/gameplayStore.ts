import { create } from "zustand";
import { getSocket } from "@/utils/socket";
import { Game } from "@/models/Game";
import getPlayerId from "@/utils/getPlayerId";
import { useConnectionStore } from "./connectionStore";

interface GameplayStore {
  startGame: (gameCode: string) => Promise<boolean>;
  startRound: () => Promise<boolean>;
  prepareRound: () => Promise<boolean>;
  endRound: () => Promise<boolean>;
  playCoins: (coins: number) => Promise<boolean>;
  changeIcon: (icon: string, color: string) => Promise<boolean>;
}

export const useGameplayStore = create<GameplayStore>((set, get) => ({
  startGame: async (gameCode: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const socket = getSocket();
      socket.emit("startGame", gameCode, (response: { error?: string }) => {
        if (response.error) {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  },

  // Function to prepare for the next round
  prepareRound: async () => {
    const game = useConnectionStore.getState().game;

    if (!game) {
      console.error("No active game found");
      return false;
    }

    return new Promise((resolve) => {
      const socket = getSocket();
      socket.emit(
        "prepareNextRound",
        game.gameCode,
        (response: { error?: string; success?: boolean }) => {
          if (response.error) {
            console.error("Failed to prepare next round:", response.error);
            resolve(false);
          } else if (response.success) {
            resolve(true);
          } else {
            console.error("Invalid response from server");
            resolve(false);
          }
        }
      );
    });
  },

  startRound: async () => {
    const game = useConnectionStore.getState().game;

    if (!game) {
      console.error("No active game found");
      return false;
    }

    if (game.roundStatus === "active") {
      console.error("Cannot start next round - current round not completed");
      return false;
    }

    return new Promise((resolve) => {
      const socket = getSocket();
      socket.emit(
        "startNextRound",
        game.gameCode,
        (response: { error?: string; success?: boolean; game?: Game }) => {
          if (response.error) {
            console.error("Failed to start next round:", response.error);
            resolve(false);
          } else if (response.success && response.game) {
            // Update game state in connectionStore
            useConnectionStore.getState().setGame(response.game);
            resolve(true);
          } else {
            console.error("Invalid response from server");
            resolve(false);
          }
        }
      );
    });
  },

  // Function to end round
  endRound: async () => {
    const game = useConnectionStore.getState().game;

    if (!game) {
      console.error("No active game found");
      return false;
    }

    return new Promise((resolve) => {
      const socket = getSocket();
      socket.emit(
        "endRound",
        game.gameCode,
        (response: { error?: string; success?: boolean }) => {
          if (response.error) {
            console.error("Failed to end round:", response.error);
            resolve(false);
          } else if (response.success) {
            resolve(true);
          } else {
            console.error("Invalid response from server");
            resolve(false);
          }
        }
      );
    });
  },

  playCoins: async (coins: number) => {
    return new Promise((resolve) => {
      const socket = getSocket();
      const game = useConnectionStore.getState().game;
      const playerId = getPlayerId();

      if (!game) {
        resolve(false);
        return;
      }

      socket.emit(
        "playCoins",
        game.gameCode,
        playerId,
        coins,
        (response: any) => {
          if (response?.error) {
            resolve(false);
            console.error(response.error);
          } else {
            resolve(true);
            console.log("Played coins successfully");
          }
        }
      );
    });
  },

  changeIcon: async (icon: string, color: string) => {
    return new Promise((resolve) => {
      const socket = getSocket();
      const game = useConnectionStore.getState().game;
      const playerId = getPlayerId();

      if (!game) {
        resolve(false);
        return;
      }

      socket.emit(
        "changeIcon",
        game.gameCode,
        playerId,
        icon,
        color,
        (response: any) => {
          if (response?.error) {
            resolve(false);
            console.error(response.error);
          } else {
            resolve(true);
            console.log("Played coins successfully");
          }
        }
      );
    });
  },
}));
