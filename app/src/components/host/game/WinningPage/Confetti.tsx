import React, { useState, useEffect, useCallback, useRef } from "react";
import styles from "./styles/Confetti.module.css";

const random = (min: number, max: number) => Math.random() * (max - min) + min;

interface ConfettiProps {
  animateConfetti: boolean;
}

interface ConfettiPiece {
  id: number;
  color: string;
  left: string;
  width: string;
  height: string;
  borderRadius: string;
  animationDuration: string;
  rotateX: string;
  rotateY: string;
  rotateZ: string;
  translateX: string;
}

const Confetti = ({ animateConfetti }: ConfettiProps) => {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Use a ref for a counter to ensure unique IDs for keys
  const idCounter = useRef(0);

  const createConfettiPiece = useCallback((): ConfettiPiece => {
    const colors = [
      "#008080", // Classic teal
      "#20B2AA", // Light sea green
      "#48D1CC", // Medium turquoise
      "#40E0D0", // Turquoise
      "#00CED1", // Dark turquoise
      "#5F9EA0", // Cadet blue
      "#008B8B", // Dark cyan
      "#2F4F4F", // Dark slate gray
      "#708090", // Slate gray
      "#778899", // Light slate gray
      "#66CDAA", // Medium aquamarine
      "#7FFFD4", // Aquamarine
      "#AFEEEE", // Pale turquoise
      "#E0FFFF", // Light cyan
      "#006666", // Dark teal
      "#009999", // Medium teal
    ];
    const shapes = ["circle"];
    const shape = shapes[Math.floor(random(0, shapes.length))];
    let width, height, borderRadius;

    switch (shape) {
      case "circle":
        width = random(6, 12);
        height = width;
        borderRadius = "50%";
        break;
      case "rectangle":
        width = random(12, 18);
        height = random(6, 9);
        borderRadius = "10%";
        break;
      default:
        width = random(8, 12);
        height = width;
        borderRadius = "10%";
    }

    return {
      id: idCounter.current++,
      color: colors[Math.floor(random(0, colors.length))],
      left: random(0, 100) + "%",
      width: width + "px",
      height: height + "px",
      borderRadius,
      animationDuration: random(2.5, 6) + "s",
      rotateX: random(360, 2440) + "deg",
      rotateY: random(360, 440) + "deg",
      rotateZ: random(0, 360) + "deg",
      translateX: random(-200, 200) + "px",
    };
  }, []);

  // Effect to manage the confetti creation interval
  useEffect(() => {
    if (animateConfetti) {
      // Start creating confetti
      intervalRef.current = setInterval(() => {
        setPieces((currentPieces) => {
          // Add a new piece, but also limit the total number to avoid performance issues
          if (currentPieces.length > 200) {
            return currentPieces;
          }
          return [...currentPieces, createConfettiPiece()];
        });
      }, 100);
    } else {
      // Stop creating confetti
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    // Cleanup function to clear interval when component unmounts
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [animateConfetti, createConfettiPiece]);

  const handleAnimationEnd = (id: number) => {
    // Remove the piece from state when its animation finishes
    setPieces((currentPieces) => currentPieces.filter((p) => p.id !== id));
  };

  return (
    <div className={styles.container}>
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className={styles.confetti}
          style={
            {
              backgroundColor: piece.color,
              left: piece.left,
              width: piece.width,
              height: piece.height,
              borderRadius: piece.borderRadius,
              animationDuration: piece.animationDuration,
              "--rotateX": piece.rotateX,
              "--rotateY": piece.rotateY,
              "--rotateZ": piece.rotateZ,
              "--translateX": piece.translateX,
            } as React.CSSProperties
          }
          // Add the event listener here
          onAnimationEnd={() => handleAnimationEnd(piece.id)}
        />
      ))}
    </div>
  );
};

export default Confetti;
