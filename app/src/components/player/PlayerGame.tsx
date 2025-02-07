import { useGameStore } from "@/store/gameStore";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import getPlayerId from "@/utils/getPlayerId";

const PlayerGame = ({
  gameCode,
  playerName,
}: {
  gameCode: string;
  playerName: string;
}) => {
  const {
    game,
    joinAsPlayer,
    cleanup,
    disconnect,
    getPlayerDetails,
    playCoins,
  } = useGameStore();
  const router = useRouter();
  const player = getPlayerDetails(getPlayerId());

  const handlePlay = () => {
    // play
    playCoins(10);
  };

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
      <h1>Game in progress</h1>
      <p>Game code: {gameCode}</p>
      <p>Player name: {player?.name}</p>
      <p>Player coins: {player?.coins}</p>

      <button
        onClick={handlePlay}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Play 10 coins
      </button>
    </div>
  );
};

export default PlayerGame;
