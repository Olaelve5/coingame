import StartNewRoundButton from "../StartNewRoundButton";
import { useConnectionStore } from "@/store/connectionStore";
import CoinsCountdown from "./CoinsCountdown";
import PlayerEliminationList from "./PlayerEliminationList";
import { useState, useEffect } from "react";
import styles from "../styles/RoundResult.module.css";

export default function RoundResult() {
  const { game } = useConnectionStore();
  const [count, setCount] = useState(50);
  const [isCountdownRunning, setIsCountdownRunning] = useState(false);

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
      />
      <div className="mb-4">
        <PlayerEliminationList count={count} />
      </div>
      {count <= 0 && <StartNewRoundButton />}
    </div>
  );
}
