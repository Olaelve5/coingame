import styles from "./styles/Podium.module.css";
import { getIcon, getColor } from "@/utils/iconUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMantineTheme } from "@mantine/core";
import { useConnectionStore } from "@/store/connectionStore";
import { motion } from "framer-motion";
import { useState } from "react";

interface PodiumProps {
  setPodiumAnimationFinished?: (finished: boolean) => void;
}

const Podium = ({ setPodiumAnimationFinished }: PodiumProps) => {
  const theme = useMantineTheme();
  const { game } = useConnectionStore();
  const [animationsFinished, setAnimationsFinished] = useState(false);

  if (!game) return null;

  const podium = {
    firstPlace: game.players.find((player) => player.endRank === 1),
    secondPlace: game.players.find((player) => player.endRank === 2),
    thirdPlace: game.players.find((player) => player.endRank === 3),
  };

  const handleEndOfAnimations = () => {
    setTimeout(() => {
      setAnimationsFinished(true);
      setTimeout(() => {
        if (setPodiumAnimationFinished) {
          setPodiumAnimationFinished(true);
        }
      }, 500);
    }, 1000);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, top: "50vh", y: "-50%" }}
      animate={{
        opacity: 1,
        top: animationsFinished ? "5rem" : "50vh",
        y: animationsFinished ? 0 : "-50%",
        position: animationsFinished ? "absolute" : "fixed",
      }}
      transition={{
        opacity: { duration: 0.5, delay: 0.5 },
        top: { duration: 0.5, ease: "easeInOut" },
        y: { duration: 0.5, ease: "easeInOut" },
        layout: { duration: 0.5, ease: "easeInOut" },
      }}
      className={styles.container}
    >
      <h1>The champions</h1>
      <div className={styles.podiumContainer}>
        <div className={styles.standContainer}>
          <motion.div
            initial={{ scale: 0, rotate: 90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.5, type: "spring", bounce: 0.3, delay: 5 }}
          >
            <FontAwesomeIcon
              icon={getIcon(podium.secondPlace?.icon || "dragon")}
              color={getColor(podium.secondPlace?.color || "cyan")}
              className={styles.icon}
            />
          </motion.div>
          <motion.div
            className={styles.stand}
            style={{
              height: "150px",
              backgroundColor: theme.colors.blue[7],
            }}
            initial={{ height: "10px" }}
            animate={{ height: "150px", opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 4 }}
          >
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, delay: 5.5 }}
            >
              2
            </motion.h2>
          </motion.div>
        </div>
        <div className={styles.standContainer}>
          <motion.div
            initial={{ scale: 0, rotate: 90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.5, type: "spring", bounce: 0.3, delay: 8 }}
          >
            <FontAwesomeIcon
              icon={getIcon(podium.firstPlace?.icon || "dragon")}
              color={getColor(podium.firstPlace?.color || "cyan")}
              className={styles.icon}
            />
          </motion.div>
          <motion.div
            className={styles.stand}
            style={{
              height: "225px",
              backgroundColor: theme.colors.yellow[7],
            }}
            initial={{ height: "10px" }}
            animate={{ height: "225px", opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 6.5 }}
          >
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, delay: 8.5 }}
              onAnimationComplete={handleEndOfAnimations}
            >
              1
            </motion.h2>
          </motion.div>
        </div>
        <div className={styles.standContainer}>
          <motion.div
            initial={{ scale: 0, rotate: 90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.5, type: "spring", bounce: 0.3, delay: 2.2 }}
          >
            <FontAwesomeIcon
              icon={getIcon(podium.thirdPlace?.icon || "dragon")}
              color={getColor(podium.thirdPlace?.color || "cyan")}
              className={styles.icon}
            />
          </motion.div>
          <motion.div
            className={styles.stand}
            style={{
              height: "75px",
              backgroundColor: theme.colors.orange[8],
            }}
            initial={{ height: "10px" }}
            animate={{ height: "75px", opacity: 1 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 1.5 }}
          >
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, delay: 2.7 }}
            >
              3
            </motion.h2>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Podium;
