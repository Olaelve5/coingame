import { useAnimate } from "framer-motion";

export const usePlayerPercentageAnimation = () => {
  const [scope, animate] = useAnimate();
  const [textScope, textAnimate] = useAnimate();

  const playAppearAnimation = async () => {
    await animate(scope.current, { scale: 0.5, opacity: 0 }, { duration: 0 });
    await animate(
      scope.current,
      { scale: 1, opacity: 1 },
      { delay: 0.6, duration: 0.5, type: "spring", bounce: 0.4 }
    );
  };

  const playBaloonPopAnimation = async () => {
    // Second part of the animation: scale down
    await animate(
      scope.current,
      {
        y: [0, 0.5, -0.5, 0.5, -0.5, 1, -1, 1, -1, 2, -2, 2, -2],
        x: [0, 0.5, -0.5, 0.5, -0.5, 0.5, -0.5, 0.5, -0.5, 0.5, -0.5, 0.5, -0.5],
        opacity: 1,
      },
      { duration: 0.75 }
    );
    await animate(scope.current, { scale: 0 }, { duration: 0.12 });
  };

  const playTextAppearAnimation = async () => {
    // Set initial state
    await textAnimate(
      textScope.current,
      { scale: 0, opacity: 0 },
      { duration: 0 }
    );

    await textAnimate(
      textScope.current,
      { opacity: 1, scale: 1 },
      {
        delay: 0.75,
        duration: 0.6,
        type: "spring",
        bounce: 0.4,
      }
    );
  };

  const playTextExitAnimation = async () => {
    await textAnimate(
      textScope.current,
      {
        scale: 1,
        rotate: [0, 0.5, -0.5, 0.5, -0.5, 1, -1, 1, -1, 2, -2, 2, -2, 0],
        opacity: 1,
      },
      { duration: 0.75 }
    );
    await animate(textScope.current, { scale: 0 }, { duration: 0.12 });
  };

  return {
    scope,
    textScope,
    playAppearAnimation,
    playBaloonPopAnimation,
    playTextExitAnimation,
    playTextAppearAnimation,
  };
};
