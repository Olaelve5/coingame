// components/CreateGameButton.tsx
"use client";
import { useRouter } from "next/navigation";
import getPlayerId from "@/utils/getPlayerId";

export default function CreateGameButton() {
  const router = useRouter();

  const onCreateGame = async () => {
    try {
      // 1. Generate game code
      const gameCode = Math.random().toString(36).substring(2, 7).toUpperCase();

      const hostId = getPlayerId();

      // 2. Create game via POST
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/games`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            gameCode,
            players: [], // Start with empty players array
            hostId,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to create game");

      // 3. Store host details
      sessionStorage.setItem("playerName", "Host");
      sessionStorage.setItem("hostId", hostId);

      // 4. Navigate to game room
      router.push(`/host/${gameCode}`);
    } catch (error) {
      console.error("Create game failed:", error);
      alert("Failed to create game. Please try again.");
    }
  };

  return (
    <button
      onClick={onCreateGame}
      className="text-2xl font-bold text-white bg-blue-500 rounded-lg px-8 py-4 hover:bg-blue-600 transition-colors">
      Create Game
    </button>
  );
}
