import EliminatedPlayers from "./EliminatedPlayers";
import CoinsCountdown from "../CoinsCountdown";
import { useState } from "react";
import styles from "./styles/EliminationsPage.module.css";
import StartRoundButton from "./StartRoundButton";
import { useConnectionStore } from "@/store/connectionStore";

const EliminationsPage = ({
  hasPageChanged,
  handleRoundPreparation,
}: {
  hasPageChanged: boolean;
  handleRoundPreparation: () => void;
}) => {
  const [countdownComplete, setCountdownComplete] = useState(false);
  const { game } = useConnectionStore();

  if (!game) {
    return <div>Loading...</div>;
  }

  const targetNumber = game.lastRoundResults.minCoinsPlayed + 1 || 0;

  return (
    <div className={styles.pageContainer}>
      <CoinsCountdown
        targetNumber={targetNumber}
        isRunning={true}
        onComplete={() => {
          console.log("Countdown complete");
          setCountdownComplete(true);
        }}
      />
      {(hasPageChanged || countdownComplete) && (
        <>
          <EliminatedPlayers  />
          <StartRoundButton handleRoundPreparation={handleRoundPreparation} />
        </>
      )}
    </div>
  );
};

export default EliminationsPage;
