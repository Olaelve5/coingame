import { motion } from "framer-motion";
import styles from "../styles/PlayersIconGrid.module.css";
import { getColor } from "@/utils/iconUtils";
import { useMemo } from "react";

interface PlayerIconParticlesProps {
  color: string;
  position?: { top?: string; left?: string };
  distance?: number;
}

export default function PlayerIconParticles({
  color,
  position = {},
  distance = 1,
}: PlayerIconParticlesProps) {
  const particleColor = getColor(color);

  // Generate random particle properties on each render
  const particles = useMemo(() => {
    return Array(6)
      .fill(null)
      .map((_, i) => {
        // Random offsets for end position (more variation)
        const xVariation = Math.random() * 40 - 20;
        const yVariation = Math.random() * 40 - 20;

        // Base directions for each particle (clock positions)
        let baseX = 0;
        let baseY = 0;

        // Starting position offset (to avoid crossing paths)
        let startX = 0;
        let startY = 0;

        switch (i) {
          case 0:
            baseY = -60 * distance + yVariation;
            baseX = xVariation;
            startY = -0;
            startX = xVariation * 0.1;
            break;
          case 1:
            baseY = -60 * distance + yVariation;
            baseX = 40 * distance + xVariation;
            startY = -0;
            startX = 0;
            break;
          case 2:
            baseY = 50 * distance + yVariation;
            baseX = 50 * distance + xVariation;
            startY = 0;
            startX = 0;
            break;
          case 3:
            baseY = 50 * distance + yVariation;
            baseX = xVariation;
            startY = 0;
            startX = xVariation * 0.1;
            break;
          case 4:
            baseY = 50 * distance + yVariation;
            baseX = -60 * distance + xVariation;
            startY = 0;
            startX = -0;
            break;
          case 5:
            baseY = -40 * distance + yVariation;
            baseX = -60 * distance + xVariation;
            startY = -0;
            startX = -0;
            break;
        }

        const size = 5 + Math.floor(Math.random() * 5);
        const duration = 0.8 + Math.random() * 0.4;
        const delay = 0.7 + i * 0.02 + Math.random() * 0.02;

        return {
          trajectory: {
            y: [startY, baseY],
            x: [startX, baseX],
          },
          size,
          duration,
          delay,
        };
      });
  }, []);

  return (
    <div
      className={styles.particleContainer}
      style={{
        position: "absolute",
        ...position,
      }}
    >
      {particles.map((particle, i) => (
        <motion.div
          key={`particle-${i}`}
          className={styles.particle}
          style={{
            background: particleColor,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            position: "absolute",
            top: "50%",
            left: "50%",
          }}
          initial={{
            scale: 0,
            x: particle.trajectory.x[0],
            y: particle.trajectory.y[0],
          }}
          animate={{
            scale: [0, 1, 0],
            y: [particle.trajectory.y[0], particle.trajectory.y[1]],
            x: [particle.trajectory.x[0], particle.trajectory.x[1]],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            ease: "easeOut",
            times: [0, 0.3, 1],
          }}
        />
      ))}
    </div>
  );
}
