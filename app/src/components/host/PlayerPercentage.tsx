import { useConnectionStore } from "@/store/connectionStore";
import { useEffect, useState } from "react";

const PlayerPercentage = () => {
  const { game } = useConnectionStore();
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    if (game) {
      const totalPlayersAlive = game.players.filter(
        (player) => !player.eliminated
      ).length;
      const playedPlayer = game.players.filter(
        (player) => player.playedInRound
      ).length;
      setPercentage((playedPlayer / totalPlayersAlive) * 100);
    }
  }, [game]);

  if (!game) return null;

  const formattedPercentage = Math.round(percentage);

  return <div>{formattedPercentage}% of bets placed</div>;
};

export default PlayerPercentage;
