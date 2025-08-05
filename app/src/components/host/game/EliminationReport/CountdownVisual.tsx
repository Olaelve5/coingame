import styles from "./styles/CountdownVisual.module.css";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";

const CountdownVisual = ({
  count,
  maxCount,
  countdownComplete,
}: {
  count: number;
  maxCount: number;
  countdownComplete: boolean;
}) => {
  const progressValue = useMotionValue(count / maxCount);

  // 2. Create a color motion value that transforms the progress.
  const backgroundColor = useTransform(
    progressValue,
    // Input range (progress from 0% to 100%)
    [0, 0.5, 1],
    // Output range (the corresponding colors)
    ["#61ff8bff", "#5bffcbff", "#51fff3ff"]
  );

  useEffect(() => {
    animate(progressValue, count / maxCount, {
      duration: 1.5,
      ease: "easeOut",
    });
  }, [count, progressValue]);

  return (
    <motion.div
      className={styles.container}
      animate={{
        y: countdownComplete ? "100%" : "0%",
      }}
      style={{
        scaleY: progressValue,
        transformOrigin: "bottom",
        backgroundColor: backgroundColor,
      }}
      transition={{
        duration: countdownComplete ? 0.5 : 1.5,
        ease: "easeOut",
      }}
    ></motion.div>
  );
};

export default CountdownVisual;
