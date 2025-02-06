// app/game/[gameCode]/page.tsx
"use client"; // Required for client-side hooks

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import HostLobby from "@/components/host/HostLobby";
import HostGame from "@/components/host/HostGame";
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

  if (!playerName) {
    return <div className="text-center p-8">Loading...</div>;
  }

  if (gameState?.status === "playing") {
    return <HostGame />;
  }

  return (
    <HostLobby
      gameCode={params.gameCode as string}
      setGameState={setGameState}
      gameState={gameState}
    />
  );
}
