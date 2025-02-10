// components/JoinGameForm.tsx
"use client";
import { useState, KeyboardEvent, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { useGameStore } from "@/store/gameStore";
import { IconArrowRight, IconDotsVertical } from "@tabler/icons-react";

export default function JoinGameForm() {
  const router = useRouter();
  const params = useParams();
  const gameCode = params.gameCode as string;
  const [playerName, setPlayerName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { prepareForNewGame } = useGameStore();
  const [errorMessage, setErrorMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && playerName.trim()) {
      handleJoinGame();
    }
  };

  const handleJoinGame = async () => {
    if (!gameCode.trim() || !playerName.trim()) {
      alert("Something went wrong! Please try again.");
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

  // Focus on input when component mounts
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="flex flex-col gap-10 w-full max-w-xs min-w-[300px] items-center">
      <div className="flex flex-col gap-3 w-full items-center">
        <h1 className="text-4xl font-bold bungee-font whitespace-nowrap mb-10">
          You're in!
        </h1>
        <h1 className="text-xl font-bold">What should we call you?</h1>
        <input
          ref={inputRef}
          type="text"
          placeholder="Nickname"
          value={playerName}
          onKeyDown={handleKeyDown}
          onChange={(e) => setPlayerName(e.target.value)}
          className="bg-slate-700 w-full py-3 px-6 outline-none text-md
          font-bold text-white rounded-lg transition-colors duration-100 border-solid focus:outline-none
          focus:ring-2
          focus:ring-blue-500
          disabled:opacity-50 
          disabled:pointer-events-none"
        />

        {errorMessage && (
          <p className="text-red-500 font-bold text-center">{errorMessage}</p>
        )}
      </div>
      <IconDotsVertical size={20} className="opacity-100" />
      <button
        onClick={handleJoinGame}
        className="relative group border-none bg-transparent p-0 outline-none cursor-pointer font-mono font-bold text-base disabled:opacity-50 disabled:pointer-events-none w-full">
        <span className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-25 rounded-lg transform translate-y-0.5 transition duration-[600ms] ease-[cubic-bezier(0.3,0.7,0.4,1)] group-hover:translate-y-1 group-hover:duration-[250ms] group-active:translate-y-px"></span>
        <span className="absolute top-0 left-0 w-full h-full rounded-lg bg-gradient-to-l from-[hsl(217,33%,16%)] via-[hsl(0, 69.80%, 49.40%)] to-[hsl(217,33%,16%)]"></span>

        <div
          className="relative flex items-center justify-between py-3 px-6 text-lg 
          text-white rounded-lg transform -translate-y-1 bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-500 gap-3 transition duration-[600ms] ease-[cubic-bezier(0.3,0.7,0.4,1)] 
          group-hover:-translate-y-1.5 group-hover:duration-[250ms] group-active:-translate-y-0.5 brightness-100 group-hover:brightness-110">
          <span className="select-none">Join game</span>
          <IconArrowRight size={26} />
        </div>
      </button>
    </div>
  );
}
