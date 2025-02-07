import { useGameStore } from "@/store/gameStore";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const HostGame = ({ gameCode }: { gameCode: string }) => {
  const { game, joinAsHost, cleanup } = useGameStore();
  const router = useRouter();

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

  return (
    <div>
      <h1>Game is playing</h1>
      <p>Game code: {game?.gameCode}</p>
      <p>Players:</p>
      <ul>
        {game?.players?.map((player) => (
          <li key={player.id}>
            {player.name} - Coins: {player.coins}
            <br />
            {player.connected ? "Connected" : "Disconnected"}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HostGame;
