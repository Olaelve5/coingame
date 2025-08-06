import { useConnectionStore } from "@/store/connectionStore";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import styles from "../styles/PlayerPercentage.module.css";
import { usePlayerPercentageAnimation } from "@/utils/animations/playerPercentageAnimations";
import PlayerIconParticles from "./PlayerIconParticle";

interface PlayerPercentage {
  onRoundEnd?: () => void;
  testingSignal?: boolean;
  startEliminationAnimations?: boolean;
}

const PlayerPercentage = ({
  onRoundEnd,
  testingSignal,
  startEliminationAnimations,
}: PlayerPercentage) => {
  const { game } = useConnectionStore();
  const [percentage, setPercentage] = useState(0);
  const {
    scope,
    textScope,
    playAppearAnimation,
    playBaloonPopAnimation,
    playTextExitAnimation,
    playTextAppearAnimation,
  } = usePlayerPercentageAnimation();

  useEffect(() => {
    if (game) {
      const totalPlayersAlive = game.players.filter((player) => !player.eliminated).length;
      const playedPlayer = game.players.filter((player) => player.playedInRound).length;
      const percentage = (playedPlayer / totalPlayersAlive) * 100;
      setPercentage(percentage);

      if (percentage >= 100 && onRoundEnd) {
        onRoundEnd();
      }
    }
  }, [game]);

  // Play the appear animation when the component is mounted
  useEffect(() => {
    playAppearAnimation();
    playTextAppearAnimation();
  }, []);

  useEffect(() => {
    if (testingSignal || startEliminationAnimations) {
      playBaloonPopAnimation();
      playTextExitAnimation();
    }
  }, [testingSignal, startEliminationAnimations]);

  const formattedPercentage = Math.round(percentage);

  return (
    <div>
      <div className={styles.container}>
        <motion.div ref={scope} style={{ scale: 0.5, opacity: 0 }} className={styles.barContainer}>
          <motion.div
            className={styles.bar}
            initial={{ height: 0 }}
            animate={{ height: `${formattedPercentage}%` }}
            transition={{
              duration: 0.5,
              type: "spring",
              bounce: 0.35,
            }}
          ></motion.div>
        </motion.div>
        <motion.div ref={textScope} className={styles.textContainer} style={{ opacity: 0 }}>
          <h2 className={styles.percentageText}>{formattedPercentage}%</h2>
          <h2 className={styles.text}>have played</h2>
        </motion.div>
      </div>
      {(startEliminationAnimations || testingSignal) && (
        <div className={styles.particleContainer}>
          <PlayerIconParticles color="yellow" distance={1.6} />
        </div>
      )}
    </div>
  );
};

export default PlayerPercentage;
