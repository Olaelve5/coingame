import { delay } from "framer-motion";

// --- Round Title Animation Variants ---
export const roundTitleAnimation = {
  initial: {
    scale: 0.5, // Start small
    x: "50%", // Center horizontally
    translateX: "-50%", // Adjust for perfect horizontal centering
    top: "50%", // Position in the middle vertically
  },
  big: {
    opacity: 1,
    y: 0, // Move to center vertically
    scale: 3, // Enlarge significantly
    x: "50%", // Center horizontally
    translateX: "-50%", // Adjust for perfect horizontal centering
    top: "50%", // Position in the middle vertically
    transition: {
      type: "spring",
      duration: 0.6,
      bounce: 0.4,
    },
  },
  normal: {
    opacity: 1,
    scale: 1, // Back to normal size
    transition: {
      type: "spring",
      duration: 0.6,
      bounce: 0.4,
    },
  },
};

export const subTitleAnimation = {
  initial: {
    scale: 0, // Start small
    x: "50%", // Center horizontally
    translateX: "-50%", // Adjust for perfect horizontal centering
    top: "calc(50% + 3rem)", 
  },
  big: {
    opacity: 1,
    y: 0, // Move to center vertically
    scale: 1.6, // Enlarge significantly
    x: "50%", // Center horizontally
    translateX: "-50%", // Adjust for perfect horizontal centering
    top: "calc(50% + 4.5rem)", // Position in the middle vertically
    transition: {
      type: "spring",
      duration: 0.6,
      bounce: 0.2,
      delay: 0.5, // Delay before starting the animation
    },
  },
  normal: {
    opacity: 0,
    scale: 0, // Back to normal size
    transition: {
      type: "spring",
      duration: 0.6,
      bounce: 0.4,
    },
  },
};
