import styles from "./styles/CountdownVisual.module.css";
import { motion } from "framer-motion";

const CountdownVisual = ({
  count,
  maxCount,
  countdownComplete,
}: {
  count: number;
  maxCount: number;
  countdownComplete: boolean;
}) => {
  const progress = count / maxCount;

  return (
    <motion.div
      className={styles.container}
      animate={{
        scaleY: progress,
        y: countdownComplete ? "100%" : "0%",
      }}
      style={{
        transformOrigin: "bottom", // Scale from bottom up
      }}
      transition={{
        duration: countdownComplete ? 0.5 : 1.5,
        ease: "easeOut",
      }}
    ></motion.div>
  );
};

export default CountdownVisual;
