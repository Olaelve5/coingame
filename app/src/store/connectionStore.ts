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

  joinAsPlayer: async (gameCode, playerName) => {
    return new Promise((resolve) => {
      const socket = getSocket();
      console.log("Starting join process...");

      // First check if player was previously kicked
      if (get().isKicked) {
        console.log("Player was previously kicked. Preventing rejoin.");
        resolve(false);
        return;
      }

      // Clean up any existing listeners first to prevent duplicates
      socket.off("gameUpdate");
      socket.off("kicked");

      // Set up a timeout to ensure we don't wait forever
      const timeout = setTimeout(() => {
        console.log("Join timeout - resolving with current state");
        const currentGame = get().game;
        resolve(!!currentGame); // Resolve based on whether we have a game
      }, 5000);

      // Connect socket if not already connected
      if (!socket.connected) {
        socket.connect();
      }

      const playerId = getPlayerId();
      console.log("Player ID:", playerId);

      // Set up kick listener before attempting to join
      socket.on("kicked", (message: string) => {
        console.log("Player kicked:", message);
        clearTimeout(timeout);
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

      // Set up game update listener
      socket.on("gameUpdate", (game: Game) => {
        console.log("Game update received:", game);
        // Only update if not kicked
        if (!get().isKicked) {
          set({ game });
        }
      });

      // Emit join event with callback
      console.log("Emitting joinGame event...");
      socket.emit(
        "joinGame",
        gameCode,
        playerName,
        playerId,
        (response: { error?: string; game?: Game }) => {
          console.log("Join game callback received:", response);
          clearTimeout(timeout); // Clear the timeout since we got a response

          if (response.error) {
            console.error("Join error:", response.error);
            resolve(false);
          } else if (response.game) {
            console.log("Join successful, game:", response.game);
            set({ game: response.game });
            resolve(true);
          } else {
            console.error("Invalid response format");
            resolve(false);
          }
        }
      );
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
