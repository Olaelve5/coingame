import { useConnectionStore } from "@/store/connectionStore";
import { useGameplayStore } from "@/store/gameplayStore";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Timer from "./Timer";
import PlayerPercentage from "./PlayerPercentage";
import PlayersIconGrid from "./PlayersIconGrid";
import styles from "../styles/HostGame.module.css";
import RoundTitle from "./RoundTitle";

const HostGame = ({ gameCode }: { gameCode: string }) => {
  const { game, joinAsHost, cleanup } = useConnectionStore();
  const { endRound, startRound } = useGameplayStore();
  const router = useRouter();
  const [timerRunning, setTimerRunning] = useState(false);
  const [titleAnimationFinished, setTitleAnimationFinished] = useState(false);

  useEffect(() => {
    const initGame = async () => {
      const success = await joinAsHost(gameCode);
      if (!success) {
        router.push("/");
      }
    };

    initGame();
    return () => cleanup();
  }, [gameCode, joinAsHost, router, cleanup]);

  // Function to handle the start of the round
  // This function is called from the RoundTitle component
  // when the title animation is finished
  const handleRoundStart = () => {
    if (game?.roundStatus !== "active") {
      setTitleAnimationFinished(true);
      console.log("Starting round from animation completion");
      setTimeout(() => {
        console.log("Starting round after delay");
        startRound();
        setTimerRunning(true);
      }, 2000); // Delay before starting the round
    } else {
      console.log("Round already active, skipping startRound call");
    }
  };

  // Useeffect to log game status and round status
  useEffect(() => {
    console.log("Game status:", game?.status);
    console.log("Round status:", game?.roundStatus);
  }, [game]);

  if (!game) return null;

  return (
    <div className={styles.container}>
      <RoundTitle handleRoundStart={handleRoundStart} />
      {titleAnimationFinished && (
        <>
          <Timer onTimeUp={endRound} timerRunning={timerRunning} />
          <PlayerPercentage />
          <PlayersIconGrid />
        </>
      )}
    </div>
  );
};

export default HostGame;
