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
  const { joinAsPlayer, cleanup, disconnect, isKicked } = useGameStore();

  useEffect(() => {
    // Don't attempt to join if already kicked
    if (isKicked) {
      router.push("/");
      console.log("Player was previously kicked. Preventing rejoin.");
      return;
    }

    const initGame = async () => {
      const success = await joinAsPlayer(gameCode, playerName);
      if (!success) {
        alert("Failed to join game");
        router.push("/");
      }
    };

    initGame();

    return () => {
      // Only cleanup if not kicked
      if (!isKicked) {
        cleanup();
        disconnect();
      }
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
