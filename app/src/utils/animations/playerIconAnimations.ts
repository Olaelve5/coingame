import { useAnimate } from "framer-motion";
import { useRef } from "react";

export const usePlayerIconAnimations = () => {
  const [scope, animate] = useAnimate();
  const currentRotation = useRef(0);

  const playRotateAnimation = () => {
    // Define a sequence of animations
    animate([
      // First, tilt slightly to the left
      [
        scope.current,
        { rotate: currentRotation.current - 15 },
        { duration: 0.5 },
      ],

      // Then perform the full rotation
      [
        scope.current,
        { rotate: 360 + currentRotation.current },
        { duration: 1, type: "spring", bounce: 0.5 },
      ],
    ]);

    // Update the current rotation to the new value
    currentRotation.current = currentRotation.current + 360;
  };

  const playExitAnimation = async () => {
    await animate(
      scope.current,
      {
        scale: 1.1,
        rotate: [
          0, -1, 1, -2, 2, -2, 2, -3, 3, -3, 3, -4, 4, -4, 4, -5, 5, -5, 5, -5,
          5, 0,
        ],
      },
      {
        duration: 0.75,
      }
    );

    await animate(
      scope.current,
      { scale: 0, opacity: 0 },
      {
        duration: 0.15,
      }
    );
  };

  return {
    scope,
    playExitAnimation,
    playRotateAnimation,
  };
};
