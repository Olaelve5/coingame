// components/JoinGameForm.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/store/gameStore";
import { IconUserPlus } from "@tabler/icons-react";

export default function JoinGameForm() {
  const router = useRouter();
  const [gameCode, setGameCode] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { prepareForNewGame } = useGameStore();
  const [errorMessage, setErrorMessage] = useState("");

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
        setErrorMessage("Game not found");
        return;
      }

      const gameData = await gameResponse.json();
      if (gameData.status !== "waiting") {
        setErrorMessage("Game is in progress");
        return;
      }

      setErrorMessage("");

      // 2. Store player name in session storage
      sessionStorage.setItem("playerName", playerName);

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
    <div className="flex flex-col gap-14 w-full max-w-xs min-w-[300px]">
      <div className="flex flex-col gap-6 w-full max-w-md">
        <input
          type="text"
          placeholder="Game Code"
          value={gameCode}
          onChange={(e) => setGameCode(e.target.value.toUpperCase())}
          className="bg-[#222630] py-3 px-6 outline-none text-white rounded-lg border-2 transition-colors duration-100 border-solid focus:border-[#596A95] border-[#2B3040]"
          maxLength={5}
        />
        <input
          type="text"
          placeholder="Your Name"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          className="bg-[#222630] py-3 px-6 outline-none text-white rounded-lg border-2 transition-colors duration-100 border-solid focus:border-[#596A95] border-[#2B3040]"
        />
      </div>
      <button
        onClick={handleJoinGame}
        disabled={isLoading}
        className="relative group border-none bg-transparent p-0 outline-none cursor-pointer font-mono font-bold text-base">
        <span className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-25 rounded-lg transform translate-y-0.5 transition duration-[600ms] ease-[cubic-bezier(0.3,0.7,0.4,1)] group-hover:translate-y-1 group-hover:duration-[250ms] group-active:translate-y-px"></span>

        <span className="absolute top-0 left-0 w-full h-full rounded-lg bg-gradient-to-l from-[hsl(217,33%,16%)] via-[hsl(0, 69.80%, 49.40%)] to-[hsl(217,33%,16%)]"></span>

        <div
          className="relative flex items-center justify-between py-3 px-6 text-lg 
          text-white rounded-lg transform -translate-y-1 bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-500 gap-3 transition duration-[600ms] ease-[cubic-bezier(0.3,0.7,0.4,1)] 
          group-hover:-translate-y-1.5 group-hover:duration-[250ms] group-active:-translate-y-0.5 brightness-100 group-hover:brightness-110">
          <span className="select-none">Join game</span>
          <IconUserPlus size={26} />
        </div>
      </button>

      {errorMessage && (
        <p className="text-red-500 text-center">{errorMessage}</p>
      )}
    </div>
  );
}
