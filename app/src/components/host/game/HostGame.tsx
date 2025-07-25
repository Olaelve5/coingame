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
  const { endRound, finalizeRoundPlays, startRound } = useGameplayStore();
  const router = useRouter();
  const [timerRunning, setTimerRunning] = useState(false);
  const [titleAnimationFinished, setTitleAnimationFinished] = useState(false);
  const [startEliminationAnimations, setStartEliminationAnimations] =
    useState(false);

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
      setTimeout(() => {
        startRound();
        setTimerRunning(true);
      }, 2000); // Delay before starting the round
    } else {
      console.log("Round already active, skipping startRound call");
    }
  };

  const handleRoundEnd = async () => {
    if (!game) return;

    const startElimination = await finalizeRoundPlays();

    if (!startElimination) {
      console.error("Failed to finalize round plays");
      return;
    }

    setTimeout(() => {
      setStartEliminationAnimations(true);
    }, 100); // Delay before ending the round
  };

  if (!game) return null;

  return (
    <div className={styles.container}>
      <RoundTitle handleRoundStart={handleRoundStart} />
      {titleAnimationFinished && (
        <>
          <Timer
            onTimeUp={handleRoundEnd}
            timerRunning={timerRunning}
            startEliminationAnimations={startEliminationAnimations}
          />
          <PlayerPercentage
            startEliminationAnimations={startEliminationAnimations}
          />
          <PlayersIconGrid
            startEliminationAnimations={startEliminationAnimations}
          />
        </>
      )}
    </div>
  );
};

export default HostGame;
