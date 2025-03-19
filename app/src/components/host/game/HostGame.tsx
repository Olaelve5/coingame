import { useConnectionStore } from "@/store/connectionStore";
import { useGameplayStore } from "@/store/gameplayStore";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Timer from "./Timer";
import PlayerPercentage from "../PlayerPercentage";
import PlayersIconGrid from "./PlayersIconGrid";
import styles from "../styles/HostGame.module.css";
import { motion } from "framer-motion";
import RoundTitle from "./RoundTitle";

const HostGame = ({ gameCode }: { gameCode: string }) => {
  const { game, joinAsHost, cleanup } = useConnectionStore();
  const { endRound, startRound } = useGameplayStore();
  const router = useRouter();
  const [titleAnimationFinished, setTitleAnimationFinished] = useState(false);
  const [timerRunning, setTimerRunning] = useState(false);

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

  useEffect(() => {
    // Only proceed if title animation is finished
    if (titleAnimationFinished && game?.roundStatus === "active") {
      console.log("Title animation finished, scheduling round start...");

      // Set a timeout to start the round after 1 second
      const timeout = setTimeout(() => {
        console.log("Starting new round...");
        setTimerRunning(true);
        startRound().then((success) => {
          if (!success) {
            console.error("Failed to start new round");
          } else {
            console.log("Round started successfully");
          }
        });
      }, 1500); // 1.5 second delay

      // Clean up timeout if component unmounts
      return () => clearTimeout(timeout);
    }
  }, [titleAnimationFinished, game?.roundStatus, startRound]);

  if (!game) return null;

  return (
    <div className={styles.container}>
      <RoundTitle
        titleAnimationFinished={titleAnimationFinished}
        setTitleAnimationFinished={setTitleAnimationFinished}
      />
      {titleAnimationFinished && (
        <>
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              delay: 0.3,
              duration: 0.5,
              type: "spring",
              bounce: 0.4,
            }}>
            <Timer onTimeUp={endRound} timerRunning={timerRunning} />
          </motion.div>
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              delay: 0.6,
              duration: 0.5,
              type: "spring",
              bounce: 0.4,
            }}>
            <PlayerPercentage />
          </motion.div>
          <PlayersIconGrid />
        </>
      )}
    </div>
  );
};

export default HostGame;
