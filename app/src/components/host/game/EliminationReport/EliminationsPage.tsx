import EliminatedPlayers from "./EliminatedPlayers";
import CoinsCountdown from "./CoinsCountdown";
import PlayersAliveRing from "./PlayersAliveRing";
import styles from "./styles/EliminationsPage.module.css";
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

  const targetNumber =
    game?.lastRoundResults.minCoinsPlayed !== undefined
      ? game.lastRoundResults.minCoinsPlayed + 1
      : 0; // Default to 0 if minCoinsPlayed is not set

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
            setCountdownComplete(true);
          }}
        />
      )}
      {countdownComplete && (
        <div className={styles.contentContainer}>
          <div className={styles.statsContainer}>
            <PlayedCoinsChart />
            <PlayersAliveRing />
          </div>
          <EliminatedPlayers />
        </div>
      )}
    </div>
  );
};

export default EliminationsPage;
