import EliminatedPlayers from "./EliminatedPlayers";
import CoinsCountdown from "../CoinsCountdown";
import { useState } from "react";
import styles from "./styles/EliminationsPage.module.css";
import StartRoundButton from "./StartRoundButton";

const EliminationsPage = ({
  hasPageChanged,
  handleRoundPreparation,
}: {
  hasPageChanged: boolean;
  handleRoundPreparation: () => void;
}) => {
  const [countdownComplete, setCountdownComplete] = useState(false);

  return (
    <div className={styles.pageContainer}>
      <CoinsCountdown
        targetNumber={9}
        isRunning={true}
        onComplete={() => {
          console.log("Countdown complete");
          setCountdownComplete(true);
        }}
      />
      {(hasPageChanged || countdownComplete) && (
        <>
          <EliminatedPlayers playersEliminated={[]} />
          <StartRoundButton handleRoundPreparation={handleRoundPreparation} />
        </>
      )}
    </div>
  );
};

export default EliminationsPage;
