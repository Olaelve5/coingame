// components/GameRoom.tsx
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/store/gameStore";

export default function PlayerLobby({
  gameCode,
  playerName,
}: {
  gameCode: string;
  playerName: string;
}) {
  const router = useRouter();

  const { joinAsPlayer, cleanup, disconnect } = useGameStore();

  useEffect(() => {
    const initGame = async () => {
      const success = await joinAsPlayer(gameCode, playerName);
      if (!success) {
        alert("Failed to join game");
        router.push("/");
      }
    };

    initGame();

    return () => {
      cleanup();
      disconnect();
    };
  }, [gameCode, playerName, joinAsPlayer, cleanup, disconnect, router]);

  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold mb-4">Game Lobby: {gameCode}</h1>
      <h2>Joined!</h2>
      <p>Waiting for game to start...</p>
    </div>
  );
}
