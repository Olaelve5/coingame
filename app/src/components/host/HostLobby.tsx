// components/GameRoom.tsx
"use client";
import { useEffect, useState } from "react";
import { socket } from "@/utils/socket";
import { Game } from "@/models/Game";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/store/gameStore";
import getPlayerId from "@/utils/getPlayerId";

export default function HostLobby({ gameCode }: { gameCode: string }) {
  const router = useRouter();
  const { game, joinAsHost, startGame, cleanup } = useGameStore();

  useEffect(() => {
    const initGame = async () => {
      const success = await joinAsHost(gameCode);
      if (!success) {
        router.push("/");
      }
    };

    initGame();
    return () => cleanup();
  }, [gameCode, joinAsHost, router, cleanup]);

  const handleStartGame = async () => {
    const success = await startGame(gameCode);
    if (!success) {
      alert("Failed to start game");
    }
  };

  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold mb-4">Game Lobby: {gameCode}</h1>
      <p>Players:</p>
      <div className="p-6 rounded-lg shadow-lg">
        <ul className="space-y-2">
          {game?.players?.map((player) => (
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
