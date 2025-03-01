"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useConnectionStore } from "@/store/connectionStore";

export default function PlayerLobby({
  gameCode,
  playerName,
}: {
  gameCode: string;
  playerName: string;
}) {
  const router = useRouter();
  const { joinAsPlayer, cleanup, disconnect, isKicked } = useConnectionStore();
  const [hasJoined, setHasJoined] = useState(false);

  useEffect(() => {
    // Check if player was kicked before attempting to join
    if (isKicked) {
      router.push("/");
      console.log("Player was previously kicked. Preventing rejoin.");
      return;
    }

    const initGame = async () => {
      const success = await joinAsPlayer(gameCode, playerName);
      if (success) {
        setHasJoined(true);
      } else {
        alert("Failed to join game");
        router.push("/");
      }
    };

    if (!hasJoined) {
      initGame();
    }

    // Cleanup function
    return () => {
      if (hasJoined && !isKicked) {
        cleanup();
        disconnect();
      }
    };
  }, [
    gameCode,
    playerName,
    joinAsPlayer,
    cleanup,
    disconnect,
    router,
    isKicked,
    hasJoined,
  ]);

  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold mb-4">Game Lobby: {gameCode}</h1>
      <h2>Joined!</h2>
      <p>Waiting for game to start...</p>
    </div>
  );
}
