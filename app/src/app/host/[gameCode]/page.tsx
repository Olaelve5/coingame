// app/game/[gameCode]/page.tsx
"use client"; // Required for client-side hooks

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import GameRoom from "@/components/GameRoom";
import { Game } from "@/models/Game";

export default function GamePage() {
  const params = useParams(); // Get URL parameters
  const [playerName, setPlayerName] = useState("");
  const [gameState, setGameState] = useState<Game | null>(null);

  useEffect(() => {
    // Retrieve player name from session storage
    // (set earlier in JoinGameForm/CreateGameButton)
    const name = sessionStorage.getItem("playerName") || "";
    setPlayerName(name);

    // Optional: Redirect if no name exists
    if (!name) window.location.href = "/";
  }, []);

  useEffect(() => {
    console.log("Game state updated:", gameState);
  }, [gameState]);

  if (!playerName) {
    return <div className="text-center p-8">Loading...</div>;
  }

  if (gameState?.status === "playing") {
    return (
      <div className="text-center p-8">
        <h1 className="text-3xl font-bold">Game in progress</h1>
      </div>
    );
  }

  return (
    <GameRoom
      gameCode={params.gameCode as string}
      setGameState={setGameState}
      gameState={gameState}
    />
  );
}
