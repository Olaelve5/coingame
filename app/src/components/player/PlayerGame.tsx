import { useConnectionStore } from "@/store/connectionStore";
import { useGameplayStore } from "@/store/gameplayStore";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import getPlayerId from "@/utils/getPlayerId";

const PlayerGame = ({
  gameCode,
  playerName,
}: {
  gameCode?: string;
  playerName?: string;
}) => {
  const [coinsToPlay, setCoinsToPlay] = useState<number>(0);
  const { game, joinAsPlayer, cleanup, disconnect, getPlayerDetails } =
    useConnectionStore();
  const { playCoins } = useGameplayStore();
  const router = useRouter();
  const player = getPlayerDetails(getPlayerId());

  const handlePlay = () => {
    if (coinsToPlay > 0 && player && coinsToPlay <= player.coins) {
      playCoins(coinsToPlay);
      setCoinsToPlay(0); // Reset after playing
    }
  };

  const handleCoinsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setCoinsToPlay(Math.min(value, player?.coins || 0)); // Limit to available coins
  };

  useEffect(() => {
    if (!gameCode || !playerName) {
      return;
    }

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

  if (player?.eliminated) {
    return <div>You have been eliminated</div>;
  }

  return (
    <div>
      {/* {game?.roundStatus === "active" && !player?.playedInRound && ( */}
        <div className="mt-4 space-y-4">
          <div className="flex space-x-2">
            <input
              type="number"
              value={coinsToPlay}
              onChange={handleCoinsChange}
              min="0"
              max={player?.coins}
              className="px-3 py-2 border rounded-lg"
              placeholder="Enter coins to play"
            />
            <button
              onClick={handlePlay}
              disabled={coinsToPlay <= 0 || coinsToPlay > (player?.coins || 0)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed">
              Play coins
            </button>
          </div>
        </div>
      {/* )} */}
    </div>
  );
};

export default PlayerGame;
