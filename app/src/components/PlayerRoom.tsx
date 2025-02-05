// components/GameRoom.tsx
"use client";
import { useEffect, useState } from "react";
import { socket } from "@/utils/socket";
import { Game } from "@/models/Game";
import { useRouter } from "next/navigation";
import getPlayerId from "@/utils/getPlayerId";

export default function GameRoom({
  gameCode,
  playerName,
  setGameState,
}: {
  gameCode: string;
  playerName: string;
  setGameState: (game: Game) => void;
}) {
  const router = useRouter();

  useEffect(() => {
    // Connect socket and join game
    socket.connect();

    const playerId = getPlayerId();

    socket.emit("joinGame", gameCode, playerName, playerId, (response: any) => {
      if (response.error) {
        alert(response.error);
        // Handle error - redirect back
        router.push("/");
      }
    });

    // Listen for game updates
    socket.on("gameUpdate", (game: Game) => {
      setGameState(game);
    });

    // Cleanup
    return () => {
      socket.off("gameUpdate");
      socket.disconnect();
    };
  }, [gameCode, playerName]);

  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold mb-4">Game Lobby: {gameCode}</h1>
      <h2>Joined!</h2>
      <p>Waiting for game to start...</p>
    </div>
  );
}
