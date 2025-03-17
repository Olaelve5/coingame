import { useConnectionStore } from "@/store/connectionStore";
import { useGameplayStore } from "@/store/gameplayStore";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PlayerDetails from "./PlayerDetails";
import PlayerBetCoins from "./PlayerBetCoins";
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
  const [coinsToBet, setCoinsToBet] = useState<number>(1);
  const router = useRouter();
  const player = getPlayerDetails(getPlayerId());

  const handlePlay = () => {
    // if (coinsToPlay > 0 && player && coinsToPlay <= player.coins) {
    //   playCoins(coinsToPlay);
    //   setCoinsToPlay(0); // Reset after playing
    // }
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

  if (!player || !game) {
    return <div>Loading...</div>;
  }

  if (player?.eliminated) {
    return <div>You have been eliminated</div>;
  }

  return (
    <div>
      <PlayerDetails player={player} />
      {game?.roundStatus === "active" && !player?.playedInRound && <div>
        <PlayerBetCoins player={player} coinsToBet={coinsToBet} setCoinsToBet={setCoinsToBet}/>
        </div>}
    </div>
  );
};

export default PlayerGame;
