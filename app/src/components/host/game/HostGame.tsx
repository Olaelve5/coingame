import { useConnectionStore } from "@/store/connectionStore";
import { useGameplayStore } from "@/store/gameplayStore";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Timer from "./Timer";
import PlayerPercentage from "./PlayerPercentage";
import PlayersIconGrid from "./PlayersIconGrid";
import styles from "./styles/HostGame.module.css";
import RoundTitle from "./RoundTitle";
import EliminationReport from "./EliminationReport/EliminationReport";
import useSound from "use-sound";
import { useSoundStore } from "@/store/soundStore";

const HostGame = ({ gameCode }: { gameCode: string }) => {
  const { game, joinAsHost, cleanup } = useConnectionStore();
  const { endRound, finalizeRoundPlays, startRound } = useGameplayStore();
  const router = useRouter();
  const [timerRunning, setTimerRunning] = useState(false);
  const [titleAnimationFinished, setTitleAnimationFinished] = useState(false);
  const [playerAnimationsFinished, setPlayerAnimationsFinished] = useState(false);
  const [startEliminationAnimations, setStartEliminationAnimations] = useState(false);
  const [timerEndAnimationFinished, setTimerEndAnimationFinished] = useState(false);
  const { getCalculatedEffectsVolume } = useSoundStore();
  const [playSong, { stop: stopSong }] = useSound("/sounds/songs/video_game.wav", {
    volume: getCalculatedEffectsVolume(),
    timeOut: 40000, // Fallback stop after 40 seconds
  });

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

  const handleRoundStart = () => {
    if (game?.roundStatus !== "active") {
      setTitleAnimationFinished(true);
      setTimeout(() => {
        startRound();
        setTimerRunning(true);
        // playSong();
      }, 2000); // Delay before starting the round
    } else {
      console.log("Round already active, skipping startRound call");
    }
  };

  const handleRoundEnd = async () => {
    if (!game) return;
    setTimerRunning(false);
    const startElimination = await finalizeRoundPlays();
    // stopSong();

    if (!startElimination) {
      console.error("Failed to finalize round plays");
      return;
    }

    setTimeout(() => {
      setStartEliminationAnimations(true);
    }, 200); // Delay before ending the round
  };

  const handleRoundPreparation = () => {
    setTitleAnimationFinished(false);
    setPlayerAnimationsFinished(false);
    setStartEliminationAnimations(false);
    setTimerEndAnimationFinished(false);
    setTimerRunning(false);
  };

  useEffect(() => {
    if (timerEndAnimationFinished && game?.roundStatus === "active") {
      console.log("Ending round due to timer animation finished");
      endRound();
    }
  }, [timerEndAnimationFinished, endRound, game?.roundStatus]);

  if (!game) return null;

  return (
    <div className={styles.container}>
      {game.roundStatus !== "eliminating" && (
        <>
          <RoundTitle
            handleRoundStart={handleRoundStart}
            startEliminationAnimations={playerAnimationsFinished}
          />
          {titleAnimationFinished && (
            <>
              <Timer
                onTimeUp={handleRoundEnd}
                timerRunning={timerRunning}
                startEliminationAnimations={playerAnimationsFinished}
                setTimerEndAnimationFinished={setTimerEndAnimationFinished}
              />
              <PlayerPercentage
                startEliminationAnimations={playerAnimationsFinished}
                onRoundEnd={handleRoundEnd}
              />
              <PlayersIconGrid
                setPlayerAnimationsFinished={setPlayerAnimationsFinished}
                startEliminationAnimations={startEliminationAnimations}
              />
            </>
          )}
        </>
      )}

      {game.roundStatus === "eliminating" && (
        <EliminationReport handleRoundPreparation={handleRoundPreparation} />
      )}
    </div>
  );
};

export default HostGame;
