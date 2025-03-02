// app/game/[gameCode]/page.tsx
"use client"; // Required for client-side hooks

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PlayerLobby from "@/components/player/PlayerLobby";
import PlayerGame from "@/components/player/PlayerGame";
import { useConnectionStore } from "@/store/connectionStore";
import { useRouter } from "next/navigation";

export default function GamePage() {
  const params = useParams(); // Get URL parameters
  const [playerName, setPlayerName] = useState("");
  const { game } = useConnectionStore();
  const router = useRouter();

  useEffect(() => {
    // Retrieve player name from session storage
    const name = sessionStorage.getItem("playerName") || "";
    setPlayerName(name);

    // Optional: Redirect if no name exists
    if (!name) window.location.href = "/";
  }, []);

  if (game?.status === "playing") {
    return (
      <PlayerGame
        gameCode={params.gameCode as string}
        playerName={playerName}
      />
    );
  }

  return (
    <PlayerLobby gameCode={params.gameCode as string} playerName={playerName} />
  );
}
