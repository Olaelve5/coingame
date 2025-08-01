import { delay } from "framer-motion";

// --- Round Title Animation Variants ---
export const roundTitleAnimation = {
  initial: {
    scale: 0.5, // Start small
    x: "50%", // Center horizontally
    translateX: "-50%", // Adjust for perfect horizontal centering
    top: "40%", // Position in the middle vertically
  },
  big: {
    opacity: 1,
    y: 0, // Move to center vertically
    scale: 3, // Enlarge significantly
    x: "50%", // Center horizontally
    translateX: "-50%", // Adjust for perfect horizontal centering
    top: "40%", // Position in the middle vertically
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
  fadeOut: {
    opacity: 0, // Fade out
    transition: {
      ease: "easeInOut",
      duration: 0.5, // Duration of the fade-out effect
      delay: 1,
    },
  },
};

export const subTitleAnimation = {
  initial: {
    scale: 0, // Start small
    x: "50%", // Center horizontally
    translateX: "-50%", // Adjust for perfect horizontal centering
    top: "calc(40% + 5rem)",
  },
  big: {
    opacity: 1,
    y: 0, // Move to center vertically
    scale: 1.6, // Enlarge significantly
    x: "50%", // Center horizontally
    translateX: "-50%", // Adjust for perfect horizontal centering
    top: "calc(40% + 5rem)", // Position in the middle vertically
    transition: {
      type: "spring",
      duration: 0.6,
      bounce: 0.2,
      delay: 0.25, // Delay before starting the animation
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
