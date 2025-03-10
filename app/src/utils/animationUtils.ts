// --- Round Title Animation Variants ---
export const roundTitleAnimation = {
  initial: {
    opacity: 0,
    y: -50, // Start slightly above
    scale: 0.5, // Start smaller
    x: "50%", // Center horizontally
    translateX: "-50%", // Adjust for perfect horizontal centering
    top: "10%", // Position near the top
  },
  big: {
    opacity: 1,
    y: 0, // Move to center vertically
    scale: 3, // Enlarge significantly
    x: "50%", // Center horizontally
    translateX: "-50%", // Adjust for perfect horizontal centering
    top: "50%", // Position in the middle vertically
    transition: {
      duration: 0.6,
      ease: "easeInOut",
    },
  },
  normal: {
    opacity: 1,
    y: -50, // Back to original position (adjust y as needed)
    scale: 1, // Back to normal size
    x: "50%", // Center horizontally
    translateX: "-50%", // Adjust for perfect horizontal centering
    top: "10%", // Back to original top position
    transition: {
      duration: 0.6,
      ease: "easeInOut",
      delay: 0.4, // Add a delay before animating back to normal
    },
  },
};
