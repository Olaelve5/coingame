import EliminatedPlayers from "./EliminatedPlayers";
import CoinsCountdown from "./CoinsCountdown";
import { useState } from "react";
import styles from "./styles/EliminationsPage.module.css";
import StartRoundButton from "./StartRoundButton";
import { useConnectionStore } from "@/store/connectionStore";

const EliminationsPage = ({
  count,
  setCount,
  START_NUMBER,
  setShouldAnimateOut,
  initialAnimationFinished,
}: {
  count: number;
  setCount: (count: number) => void;
  START_NUMBER: number;
  setShouldAnimateOut: (shouldAnimate: boolean) => void;
  initialAnimationFinished: boolean;
}) => {
  const [countdownComplete, setCountdownComplete] = useState(false);
  const { game } = useConnectionStore();

  // if (!game) {
  //   return <div>Loading...</div>;
  // }

  const targetNumber = game?.lastRoundResults.minCoinsPlayed
    ? game.lastRoundResults.minCoinsPlayed + 1
    : 5;

  return (
    <div className={styles.pageContainer}>
      {!countdownComplete && initialAnimationFinished && (
        <CoinsCountdown
          count={count}
          setCount={setCount}
          startNumber={START_NUMBER}
          targetNumber={targetNumber}
          isRunning={true}
          onComplete={() => {
            console.log("Countdown complete");
            setCountdownComplete(true);
          }}
        />
      )}
      {countdownComplete && (
        <>
          <EliminatedPlayers />
          <StartRoundButton setShouldAnimateOut={setShouldAnimateOut} />
        </>
      )}
    </div>
  );
};

export default EliminationsPage;
