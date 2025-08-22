import { motion } from "framer-motion";

interface StaggeredTextProps {
  text: string;
  initialDelay?: number;
  staggerSpeed?: number;
  onAnimationComplete?: () => void;
}

export const StaggeredText = ({
  text,
  initialDelay,
  staggerSpeed,
  onAnimationComplete,
}: StaggeredTextProps) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: staggerSpeed ?? 0.02, // Stagger Speed
        delayChildren: initialDelay ?? 0, // Initial Delay
      },
    },
  };

  // Letter animation
  const letter = {
    hidden: { opacity: 0, y: -15 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.h3
      variants={container}
      initial="hidden"
      animate="show"
      onAnimationComplete={() => {
        if (typeof onAnimationComplete === "function") {
          onAnimationComplete();
        }
      }}
    >
      {text.split("").map((char, index) => (
        <motion.span
          key={index}
          variants={letter}
          style={{ display: "inline-block", whiteSpace: "pre" }}
        >
          {char}
        </motion.span>
      ))}
    </motion.h3>
  );
};
