// components/GameRoom.tsx
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/store/gameStore";
import QRCode from "./QRCode";
import getPlayerId from "@/utils/getPlayerId";

export default function HostLobby({ gameCode }: { gameCode: string }) {
  const router = useRouter();
  const { game, joinAsHost, startGame, cleanup } = useGameStore();

  useEffect(() => {
    const initGame = async () => {
      const success = await joinAsHost(gameCode);
      if (!success) {
        router.push("/");
      }
    };

    initGame();
    return () => cleanup();
  }, [gameCode, joinAsHost, router, cleanup]);

  const handleStartGame = async () => {
    const success = await startGame(gameCode);
    if (!success) {
      alert("Failed to start game");
    }
  };

  // Split the game code into two parts, half each
  const gameCodeString = gameCode.slice(0, 3) + " - " + gameCode.slice(3);

  return (
    <div className="text-center items-center bg-sky-500 space-y-4 w-full overflow-x-hidden h-dvh">
      <div className="flex flex-col items-center space-x-4 bg-red-500 pb-10 pt-4">
        <h1 className="text-3xl bungee-font font-bold mb-10">Cashfall</h1>
        <div className="flex justify-around items-center w-full">
          <h1 className="text-6xl bungee-font font-bold mb-4">
            {gameCodeString}
          </h1>
          <QRCode gameCode={gameCode} />
        </div>
        <button className="text-xl font-bold">Start Game</button>
      </div>

      <div className="flex justify-around items-center w-full">
        <div className="flex items-center justify-center space-x-2 mb-6 mt-2">
          <h2 className="text-4xl font-bold bungee-font">
            {game?.players.filter((player) => player.connected).length}
          </h2>
          <p className="text-xl font-bold">players joined</p>
        </div>
      </div>

      <div className="w-full max-w-4xl mx-auto px-4">
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
          {game?.players
            ?.filter((player) => player.connected)
            ?.map((player) => (
              <li
                key={player.id}
                className="bg-slate-800 rounded-lg p-4 text-xl font-bold w-48 text-center">
                {player.name}
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
