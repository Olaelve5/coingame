// app/game/[gameCode]/page.tsx
"use client"; // Required for client-side hooks

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import HostLobby from "@/components/host/HostLobby";
import HostGame from "@/components/host/HostGame";
import { useConnectionStore } from "@/store/connectionStore";

export default function GamePage() {
  const params = useParams(); // Get URL parameters
  const [playerName, setPlayerName] = useState("");
  const { game } = useConnectionStore();

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

  if (game?.status !== "waiting") {
    return <HostGame gameCode={params.gameCode as string} />;
  }

  return <HostLobby gameCode={params.gameCode as string} />;
}
