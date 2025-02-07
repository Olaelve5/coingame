// components/JoinGameForm.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/store/gameStore";

export default function JoinGameForm() {
  const router = useRouter();
  const [gameCode, setGameCode] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { prepareForNewGame } = useGameStore();

  const handleJoinGame = async () => {
    if (!gameCode.trim() || !playerName.trim()) {
      alert("Please enter both game code and your name");
      return;
    }

    try {
      setIsLoading(true);

      // Prepare for new game (clean up existing listeners and connection)
      prepareForNewGame();
      
      // 1. Verify game exists
      const gameResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/games/${gameCode}`
      );

      if (!gameResponse.ok) {
        throw new Error("Game not found");
      }

      // 2. Store player name in session storage
      sessionStorage.setItem("playerName", playerName);
      sessionStorage.setItem("isHost", "false");
      
      // 3. Navigate to game room
      router.push(`/game/${gameCode}`);

    } catch (error) {
      console.error("Join game failed:", error);
      alert("Failed to join game. Please check the code and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <input
        type="text"
        placeholder="Game Code"
        value={gameCode}
        onChange={(e) => setGameCode(e.target.value.toUpperCase())}
        className="text-2xl px-4 py-2 border rounded-lg text-center uppercase"
        maxLength={5}
      />
      <input
        type="text"
        placeholder="Your Name"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
        className="text-2xl px-4 py-2 border rounded-lg text-center"
      />
      <button
        onClick={handleJoinGame}
        disabled={isLoading}
        className="text-2xl font-bold text-white bg-green-500 rounded-lg px-8 py-4 hover:bg-green-600 transition-colors disabled:opacity-50"
      >
        {isLoading ? "Joining..." : "Join Game"}
      </button>
    </div>
  );
}