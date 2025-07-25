import { create } from "zustand";
import { getSocket } from "@/utils/socket";
import { Game } from "@/models/Game";
import getPlayerId from "@/utils/getPlayerId";
import { useConnectionStore } from "./connectionStore";

interface GameplayStore {
  startRound: () => Promise<boolean>;
  prepareRound: (gameCode: string) => Promise<boolean>;
  endRound: () => Promise<boolean>;
  finalizeRoundPlays: () => Promise<boolean>;
  playCoins: (coins: number) => Promise<boolean>;
  changeIcon: (icon: string, color: string) => Promise<boolean>;
}

export const useGameplayStore = create<GameplayStore>((set, get) => ({
  // Function to prepare for the next round
  prepareRound: async (gameCode: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const socket = getSocket();
      socket.emit("prepareRound", gameCode, (response: { error?: string; game?: Game }) => {
        if (response.error) {
          console.error("Failed to prepare round:", response.error);
          resolve(false);
        } else {
          // Update game state if provided
          if (response.game) {
            useConnectionStore.getState().setGame(response.game);
          }
          resolve(true);
        }
      });
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
            console.log(response);
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

  // Function to signal to server to make all players play their coins
  // if they haven't already
  finalizeRoundPlays: async () => {
    const game = useConnectionStore.getState().game;
    if (!game) return false;

    return new Promise((resolve) => {
      const socket = getSocket();
      socket.emit(
        "finalizeRoundPlays",
        game.gameCode,
        (response: { error?: string; success?: boolean; game?: Game }) => {
          if (response.error) {
            console.error("Failed to finalize round plays:", response.error);
            resolve(false);
          } else if (response.success && response.game) {
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
      socket.emit("endRound", game.gameCode, (response: { error?: string; success?: boolean }) => {
        if (response.error) {
          console.error("Failed to end round:", response.error);
          resolve(false);
        } else if (response.success) {
          resolve(true);
        } else {
          console.error("Invalid response from server");
          resolve(false);
        }
      });
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

      socket.emit("playCoins", game.gameCode, playerId, coins, (response: any) => {
        if (response?.error) {
          resolve(false);
          console.error(response.error);
        } else {
          resolve(true);
          console.log("Played coins successfully");
        }
      });
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

      socket.emit("changeIcon", game.gameCode, playerId, icon, color, (response: any) => {
        if (response?.error) {
          resolve(false);
          console.error(response.error);
        } else {
          resolve(true);
          console.log("Played coins successfully");
        }
      });
    });
  },
}));
