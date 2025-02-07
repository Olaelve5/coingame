import { create } from "zustand";
import { socket } from "@/utils/socket";
import { Game } from "@/models/Game";
import getPlayerId from "@/utils/getPlayerId";

interface GameStore {
  game: Game | null;
  setGame: (game: Game | null) => void;
  updatePlayers: (players: Game["players"]) => void;
  prepareForNewGame: () => void;
  joinAsHost: (gameCode: string) => Promise<boolean>;
  joinAsPlayer: (gameCode: string, playerName: string) => Promise<boolean>;
  startGame: (gameCode: string) => Promise<boolean>;
  getPlayerDetails: (playerId: string) => Game["players"][0] | null;
  cleanup: () => void;
  disconnect: () => void;
  playCoins: (coins: number) => Promise<boolean>;
}

export const useGameStore = create<GameStore>((set, get) => ({
  game: null,
  setGame: (game) => set({ game }),

  updatePlayers: (players) =>
    set((state) => {
      if (!state.game) return state;
      return { game: { ...state.game, players } };
    }),

  prepareForNewGame: () => {
    // Clean up existing listeners and connection
    socket.off("gameUpdate");
    socket.off("playersUpdate");
    if (socket.connected) {
      socket.disconnect();
    }
    set({ game: null });
  },

  joinAsHost: async (gameCode) => {
    return new Promise((resolve) => {
      socket.connect();
      const hostId = getPlayerId();

      socket.emit("joinRoomAsHost", gameCode, hostId, (game: Game | null) => {
        if (game) {
          set({ game });
          resolve(true);
        } else {
          resolve(false);
        }
      });

      // Set up listeners
      socket.on("gameUpdate", (game: Game) => {
        set({ game });
      });

      socket.on("playersUpdate", (players: Game["players"]) => {
        get().updatePlayers(players);
      });
    });
  },

  joinAsPlayer: async (gameCode, playerName) => {
    return new Promise((resolve) => {
      socket.connect();
      const playerId = getPlayerId();

      socket.emit(
        "joinGame",
        gameCode,
        playerName,
        playerId,
        (response: { error?: string; game?: Game }) => {
          if (response.error) {
            resolve(false);
          } else if (response.game) {
            set({ game: response.game });
            resolve(true);
          } else {
            resolve(false);
          }
        }
      );

      // Set up listener
      socket.on("gameUpdate", (game: Game) => {
        set({ game });
      });
    });
  },

  startGame: async (gameCode) => {
    return new Promise((resolve) => {
      socket.emit("startGame", gameCode, (response: any) => {
        if (response.error) {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  },

  getPlayerDetails: (playerId: string) => {
    const game = get().game;
    if (!game || !game.players) return null;
    return game.players.find((player) => player.id === playerId) || null;
  },

  cleanup: () => {
    socket.off("gameUpdate");
    socket.off("playersUpdate");
  },

  disconnect: () => {
    if (!socket.connected) return;
    socket.disconnect();
  },

  playCoins: async (coins: number) => {
    return new Promise((resolve) => {
      const game = get().game;
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
}));
