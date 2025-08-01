import EliminatedPlayers from "./EliminatedPlayers";
import CoinsCountdown from "./CoinsCountdown";
import { useState } from "react";
import styles from "./styles/EliminationsPage.module.css";
import StartRoundButton from "./StartRoundButton";
import { useConnectionStore } from "@/store/connectionStore";
import PlayedCoinsChart from "./PlayedCoinsChart";

const EliminationsPage = ({
  count,
  setCount,
  START_NUMBER,
  countdownComplete,
  setCountdownComplete,
  setShouldAnimateOut,
  initialAnimationFinished,
}: {
  count: number;
  setCount: (count: number) => void;
  START_NUMBER: number;
  countdownComplete: boolean;
  setCountdownComplete: (finished: boolean) => void;
  setShouldAnimateOut: (shouldAnimate: boolean) => void;
  initialAnimationFinished: boolean;
}) => {
  const { game } = useConnectionStore();

  // if (!game) {
  //   return <div>Loading...</div>;
  // }

  const targetNumber = game?.lastRoundResults.minCoinsPlayed
    ? game.lastRoundResults.minCoinsPlayed + 1
    : 29;

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
        <div className={styles.contentContainer}>
          <div className={styles.statsContainer}>
            <PlayedCoinsChart />
          </div>
          <EliminatedPlayers />
          <StartRoundButton setShouldAnimateOut={setShouldAnimateOut} />
        </div>
      )}
    </div>
  );
};

export default EliminationsPage;
