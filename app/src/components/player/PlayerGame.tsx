import { useGameStore } from "@/store/gameStore";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const PlayerGame = ({
  gameCode,
  playerName,
}: {
  gameCode: string;
  playerName: string;
}) => {
  const { game, joinAsPlayer, cleanup, disconnect } = useGameStore();
  const router = useRouter();

  useEffect(() => {
    const initGame = async () => {
      const success = await joinAsPlayer(gameCode, playerName);
      if (!success) {
        router.push("/");
      }
    };

    initGame();
    return () => {
      cleanup();
      disconnect();
    };
  }, [gameCode, joinAsPlayer, router, cleanup, disconnect, playerName]);

  return (
    <div>
      <h1>Player Game</h1>
    </div>
  );
};

export default PlayerGame;
