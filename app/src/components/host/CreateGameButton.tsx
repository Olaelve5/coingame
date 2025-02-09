// components/CreateGameButton.tsx
"use client";
import { useRouter } from "next/navigation";
import getPlayerId from "@/utils/getPlayerId";
import { useGameStore } from "@/store/gameStore";
import { IconPlus } from "@tabler/icons-react";

export default function CreateGameButton() {
  const router = useRouter();
  const { prepareForNewGame } = useGameStore();

  const onCreateGame = async () => {
    try {
      // 1. Generate game code
      const gameCode = Math.random().toString(36).substring(2, 7).toUpperCase();

      const hostId = getPlayerId();

      // Prepare for new game (clean up existing listeners and connection)
      prepareForNewGame();

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
      className="group relative inline-flex h-[calc(48px+8px)] items-center justify-center rounded-full bg-gradient-to-r from-[#f27121] via-[#e94057] to-[#8a2387] py-1 pl-6 pr-14 font-bold text-2xl">
      <span className="z-10 pr-2">Host game</span>
      <div className="absolute right-1 inline-flex h-12 w-12 items-center justify-end rounded-full bg-neutral-800 transition-[width] group-hover:w-[calc(100%-8px)]">
        <div className="flex items-center justify-center h-12 w-12 rounded-full">
          <IconPlus size={24} />
        </div>
      </div>
    </button>
  );
}
