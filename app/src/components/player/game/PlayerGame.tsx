import { useConnectionStore } from "@/store/connectionStore";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../styles/PlayerGame.module.css";
import PlayerDetails from "./PlayerDetails";
import CoinCircle from "./CoinCircle";
import getPlayerId from "@/utils/getPlayerId";
import CoinButtons from "./CoinButtons";
import WaitingForPlayers from "./WaitingForPlayers";

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
  const [coinsToBet, setCoinsToBet] = useState<number>(1);
  const router = useRouter();
  const player = getPlayerDetails(getPlayerId());

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

  if (game.roundStatus === "active" && player?.playedInRound) {
    return (
      <div className={styles.container}>
        <WaitingForPlayers player={player} />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <PlayerDetails player={player} />
      {game?.roundStatus === "active" && !player?.playedInRound && (
        <div>
          <CoinCircle coinsToBet={coinsToBet} setCoinsToBet={setCoinsToBet} />
        </div>
      )}
      <CoinButtons
        player={player}
        coinsToBet={coinsToBet}
        setCoinsToBet={setCoinsToBet}
      />
    </div>
  );
};

export default PlayerGame;
