import { create } from "zustand";
import { getSocket } from "@/utils/socket";
import { Game } from "@/models/Game";
import getPlayerId from "@/utils/getPlayerId";

interface ConnectionStore {
  game: Game | null;
  setGame: (game: Game | null) => void;
  updatePlayers: (players: Game["players"]) => void;
  prepareForNewGame: () => void;
  joinAsHost: (gameCode: string) => Promise<boolean>;
  joinAsPlayer: (gameCode: string, playerName: string) => Promise<boolean>;
  getPlayerDetails: (playerId: string) => Game["players"][0] | null;
  cleanup: () => void;
  disconnect: () => void;
  isKicked: boolean;
  kickPlayer: (
    playerIdToKick: string
  ) => Promise<{ success: boolean; message: string }>;
}

export const useConnectionStore = create<ConnectionStore>((set, get) => ({
  game: null,
  setGame: (game) => set({ game }),
  isKicked: false,

  updatePlayers: (players) =>
    set((state) => {
      if (!state.game) return state;
      return { game: { ...state.game, players } };
    }),

  prepareForNewGame: () => {
    // Clean up existing listeners and connection
    const socket = getSocket();
    socket.off("gameUpdate");
    socket.off("playersUpdate");
    if (socket.connected) {
      socket.disconnect();
    }
    set({ game: null, isKicked: false });
  },

  joinAsHost: async (gameCode) => {
    return new Promise((resolve) => {
      const socket = getSocket();
      if (get().isKicked) {
        console.log("Player was previously kicked. Preventing rejoin.");
        resolve(false); // Prevent rejoining
        return;
      }

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
        // Only update game if not kicked
        if (!get().isKicked) {
          set({ game });
        }
      });

      socket.on("playersUpdate", (players: Game["players"]) => {
        get().updatePlayers(players);
      });
    });
  },

  // Inside your useGameStore.ts file, modify the joinAsPlayer function:

  joinAsPlayer: async (gameCode, playerName) => {
    return new Promise((resolve) => {
      const socket = getSocket();

      // First check if player was previously kicked
      if (get().isKicked) {
        console.log("Player was previously kicked. Preventing rejoin.");
        resolve(false);
        return;
      }

      socket.connect();
      const playerId = getPlayerId();

      // Set up kick listener before attempting to join
      socket.on("kicked", (message: string) => {
        console.log("Player kicked:", message);

        // Set kicked state first
        set({ game: null, isKicked: true });

        // Disconnect socket
        socket.disconnect();

        // Clear session storage
        sessionStorage.removeItem("playerName");
        sessionStorage.removeItem("playerId");
        sessionStorage.removeItem("hostId");

        // Navigate first, then show alert
        window.location.href = "/";
        setTimeout(() => {
          alert("You have been kicked from the game");
        }, 100);
      });

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
        // Only update if not kicked
        if (!get().isKicked) {
          set({ game });
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
    // Only clean up if not kicked
    if (!get().isKicked) {
      const socket = getSocket();
      socket.off("gameUpdate");
      socket.off("playersUpdate");
      socket.off("kicked");
    }
  },

  disconnect: () => {
    const socket = getSocket();
    if (!socket.connected) {
      console.error("Socket is already disconnected");
      return;
    }
    socket.disconnect();
  },

  kickPlayer: async (playerIdToKick: string) => {
    return new Promise((resolve) => {
      const socket = getSocket();
      const game = get().game;

      if (!game) {
        resolve({
          success: false,
          message: "No active game found",
        });
        return;
      }

      socket.emit(
        "kickPlayer",
        game.gameCode,
        playerIdToKick,
        (response: { success: boolean; message: string }) => {
          if (response.success) {
            // No need to update game state here as we'll receive a playersUpdate event
            resolve(response);
          } else {
            console.error("Failed to kick player:", response.message);
            resolve(response);
          }
        }
      );
    });
  },
}));
