// components/CreateGameButton.tsx
"use client";
import { useRouter } from "next/navigation";
import getPlayerId from "@/utils/getPlayerId";
import { useGameStore } from "@/store/gameStore";
import { IconPlus, IconDeviceGamepad2 } from "@tabler/icons-react";

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
      className="relative group border-none bg-transparent p-0 outline-none cursor-pointer font-mono font-bold text-base">
      <span className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-25 rounded-lg transform translate-y-0.5 transition duration-[600ms] ease-[cubic-bezier(0.3,0.7,0.4,1)] group-hover:translate-y-1 group-hover:duration-[250ms] group-active:translate-y-px"></span>

      <span className="absolute top-0 left-0 w-full h-full rounded-lg bg-gradient-to-l from-[hsl(217,33%,16%)] via-[hsl(0, 69.80%, 49.40%)] to-[hsl(217,33%,16%)]"></span>

      <div
        className="relative flex items-center justify-between py-3 px-6 text-lg 
        text-white rounded-lg transform -translate-y-1 bg-gradient-to-r from-orange-500 via-red-500 to-rose-500 gap-3 transition duration-[600ms] ease-[cubic-bezier(0.3,0.7,0.4,1)] 
        group-hover:-translate-y-1.5 group-hover:duration-[250ms] group-active:-translate-y-0.5 brightness-100 group-hover:brightness-110">
        <span className="select-none">Host game</span>
        <IconDeviceGamepad2
          size={26}
          className="ml-2 -mr-1 transition duration-250 group-hover:translate-x-1"
        />
      </div>
    </button>
  );
}
