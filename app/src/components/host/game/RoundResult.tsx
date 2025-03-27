import StartNewRoundButton from "../StartNewRoundButton";
import { useConnectionStore } from "@/store/connectionStore";
import CoinsCountdown from "./CoinsCountdown";
import PlayerEliminationList from "./PlayerEliminationList";
import { useState, useEffect, useMemo } from "react";
import styles from "../styles/RoundResult.module.css";

export default function RoundResult() {
  const { game } = useConnectionStore();
  const [count, setCount] = useState(50);
  const [isCountdownRunning, setIsCountdownRunning] = useState(false);

  // Get unique coin values from all players in this round
  const playerCoinValues = useMemo(() => {
    if (!game) return [];

    const values = game.players
      .filter(
        (player) =>
          player.roundHistory &&
          player.roundHistory.length >= game.round &&
          player.roundHistory[game.round - 1] !== undefined
      )
      .map((player) => player.roundHistory[game.round - 1].coinsPlayed);

    // Get unique values and sort in descending order
    return [...new Set(values)].sort((a, b) => b - a);
  }, [game]);

  useEffect(() => {
    if (game) {
      setIsCountdownRunning(true);
    }
  }, [game]);

  if (!game) return null;

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <h1>Elimination Report</h1>
        <h1 className={styles.roundNumber}>{game.round}</h1>
      </div>
      <CoinsCountdown
        count={count}
        setCount={setCount}
        isCountdownRunning={isCountdownRunning}
        playerCoinValues={playerCoinValues} // Pass player coin values
        pauseDuration={1000} // 1 second pause when hitting a player's count
      />
      <div className="mb-4">
        <PlayerEliminationList count={count} />
      </div>
      {count <= 0 && <StartNewRoundButton />}
    </div>
  );
}
