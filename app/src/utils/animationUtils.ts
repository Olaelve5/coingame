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
