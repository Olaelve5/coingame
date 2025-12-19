import { color, motion } from "framer-motion";
import { useConnectionStore } from "@/store/connectionStore";
import { roundTitleAnimation, subTitleAnimation } from "@/utils/animationUtils";
import styles from "./styles/HostGame.module.css";
import { useEffect, useRef, useState } from "react";
import PlayerIconParticles from "./PlayerIconParticle";
import { useMantineTheme } from "@mantine/core";

// Define the interface for the props
interface RoundTitleProps {
  handleRoundStart: () => void;
  prepareForNextRound: boolean;
}

export default function RoundTitle({ handleRoundStart, prepareForNextRound }: RoundTitleProps) {
  const { game } = useConnectionStore();
  const theme = useMantineTheme();
  const [animationState, setAnimationState] = useState("initial");
  const animationHandled = useRef(false); // Track if animation has been handled, to prevent multiple calls

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationState("big"); // Animate to 'big' after a short delay
      setTimeout(() => {
        setAnimationState("normal"); // Animate to 'normal' after 'big' state
      }, 3000); // Delay in 'big' state
    }, 1000); // Initial delay before starting animation

    return () => clearTimeout(timer); // Clear timeout if component unmounts
  }, []);

  useEffect(() => {
    // if (prepareForNextRound) {
    //   setAnimationState("fadeOut");
    // }
  }, [prepareForNextRound]);

  const playerCount = game?.players.filter((player) => !player.eliminated).length || 0;
  const minimumEliminations = Math.min(playerCount - 1, game?.gameSettings.elimsPerRound || 0);
  const isFinalRound = (game?.gameSettings.elimsPerRound || 0) >= playerCount;

  return (
    <div className={styles.roundTitleContainer}>
      <motion.div
        animate={animationState}
        variants={roundTitleAnimation}
        onAnimationComplete={() => {
          if (animationState === "normal" && !animationHandled.current) {
            animationHandled.current = true;
            handleRoundStart();
          }
        }}
        className={styles.title}
      >
        {isFinalRound ? (
          <h2 style={{ color: theme.colors.red[7] }}>Final Round</h2>
        ) : (
          <>
            <h2>Round</h2>
            <h2 className={styles.number}>{game?.round || 1}</h2>
          </>
        )}
      </motion.div>

      {!isFinalRound && (
        <motion.div
          className={styles.subTitle}
          animate={animationState}
          variants={subTitleAnimation}
        >
          <h3>Eliminating at least</h3>
          <h3 style={{ color: theme.colors.red[7] }}>{minimumEliminations}</h3>
          <h3>players</h3>
        </motion.div>
      )}

      {prepareForNextRound && (
        <div className={styles.particleContainer}>
          <PlayerIconParticles color="yellow" distance={1.5} />
        </div>
      )}
    </div>
  );
}
