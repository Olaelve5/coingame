import { RingProgress } from "@mantine/core";
import { StaggeredText } from "../../StaggeredText";
import { useMantineTheme } from "@mantine/core";
import styles from "./styles/RoundStats.module.css";
import { IconUserX } from "@tabler/icons-react";
import { useConnectionStore } from "@/store/connectionStore";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const PlayersAliveRing = () => {
  const theme = useMantineTheme();
  const { game } = useConnectionStore();
  const [totalEliminations, setTotalEliminations] = useState(0);
  const [showLabel, setShowLabel] = useState(false);

  const newEliminations = game?.lastRoundResults?.playersEliminated.length || 0;
  const oldEliminationCount = game?.players.filter((player) => player.eliminated).length || 0;
  const totalPlayers = game?.players.length || 0;

  useEffect(() => {
    setShowLabel(false);

    const timer1 = setTimeout(() => {
      setTotalEliminations(newEliminations + oldEliminationCount);
    }, 500);

    const timer2 = setTimeout(() => {
      setShowLabel(true);
    }, 1500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [newEliminations, oldEliminationCount]);

  return (
    <motion.div
      initial={{ opacity: 1, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5, ease: "easeInOut" }}
      className={styles.ringContainer}
    >
      <div className={styles.titleContainer}>
        <IconUserX className={styles.chartIcon} size={30} />
        <StaggeredText text="Players Eliminated" initialDelay={1.4} staggerSpeed={0.02} />
      </div>
      <div className={styles.ring}>
        <RingProgress
          sections={[
            {
              value: (totalEliminations / totalPlayers) * 100,
              color: theme.colors.blue[5],
            },
          ]}
          label={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: showLabel ? 1 : 0 }}
              transition={{ duration: 0.5 }}
              style={{ textAlign: "center" }}
            >
              <p>
                {totalEliminations}/{totalPlayers}
              </p>
            </motion.div>
          }
          size={160}
          thickness={15}
          transitionDuration={1000}
          roundCaps
          rootColor="rgba(112, 115, 121, 1)"
        />
      </div>
    </motion.div>
  );
};

export default PlayersAliveRing;
