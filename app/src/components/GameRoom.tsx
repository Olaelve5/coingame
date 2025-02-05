// components/GameRoom.tsx
"use client";
import { useEffect, useState } from "react";
import { socket } from "@/utils/socket";
import { Game } from "@/models/Game";
import { useRouter } from "next/navigation";
import getPlayerId from "@/utils/getPlayerId";

export default function GameRoom({
  gameCode,
  setGameState,
  gameState,
}: {
  gameCode: string;
  setGameState: (game: Game | ((prevGame: Game | null) => Game | null)) => void;
  gameState: Game | null;
}) {
  const router = useRouter();

  const handleStartGame = () => {
    socket.emit("startGame", gameCode, (response: any) => {
      if (response.error) {
        alert(response.error);
      } else {
        console.log("Game started");
      }
    });
  };

  useEffect(() => {
    // Connect socket and join game
    socket.connect();

    const hostId = getPlayerId();

    socket.emit("joinRoomAsHost", gameCode, hostId, (game: Game | null) => {
      if (!game) {
        // Handle error - redirect back
        router.push("/");
        return;
      }
      setGameState(game);
    });

    // Listen for game updates
    socket.on("gameUpdate", (game: Game) => {
      console.log("Game updated");
      setGameState(game);
    });

    // Listen for game updates
    socket.on("playersUpdate", (players: Game["players"]) => {
      console.log("Players updated:", players);
      setGameState((prevState: Game | null): Game | null => {
        if (!prevState) return null; // Ensure we don't return an invalid state
        return { ...prevState, players }; // TypeScript now knows it's a valid Game object
      });
    });

    // Cleanup
    return () => {
      socket.off("gameUpdate");
      socket.off("playersUpdate");
    };
  }, [gameCode]);

  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold mb-4">Game Lobby: {gameCode}</h1>
      <p>Players:</p>
      <div className="p-6 rounded-lg shadow-lg">
        <ul className="space-y-2">
          {gameState?.players?.map((player) => (
            <li key={player.id} className="text-lg">
              {player.name} {player.id === getPlayerId() && "(You)"}
              <br />
              Coins: {player.coins}
              <br />
              {player.connected ? "Connected" : "Disconnected"}
            </li>
          ))}
        </ul>
      </div>
      <button
        onClick={handleStartGame}
        className="mt-4 text-2xl font-bold text-white bg-blue-500 rounded-lg px-8 py-4 hover:bg-blue-600 transition-colors">
        Start Game
      </button>
    </div>
  );
}
