import styles from "./styles/CountdownVisual.module.css";
import { motion } from "framer-motion";

const CountdownVisual = ({ count, maxCount }: { count: number; maxCount: number }) => {
  const progress = count / maxCount;

  return (
    <motion.div
      className={styles.container}
      animate={{
        scaleY: progress,
      }}
      style={{
        transformOrigin: "bottom", // Scale from bottom up
      }}
      transition={{
        duration: 1.5,
        ease: "easeOut",
      }}
    ></motion.div>
  );
};

export default CountdownVisual;
