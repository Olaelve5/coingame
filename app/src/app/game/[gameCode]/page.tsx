// app/game/[gameCode]/page.tsx
"use client"; // Required for client-side hooks

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import PlayerRoom from "@/components/PlayerRoom";
import { Game } from "@/models/Game";

export default function GamePage() {
  const params = useParams(); // Get URL parameters
  const [playerName, setPlayerName] = useState("");
  const [gameState, setGameState] = useState<Game | null>(null);

  useEffect(() => {
    // Retrieve player name from session storage
    const name = sessionStorage.getItem("playerName") || "";
    setPlayerName(name);

    // Optional: Redirect if no name exists
    if (!name) window.location.href = "/";
  }, []);

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
    <PlayerRoom
      gameCode={params.gameCode as string}
      playerName={playerName}
      setGameState={setGameState}
    />
  );
}
