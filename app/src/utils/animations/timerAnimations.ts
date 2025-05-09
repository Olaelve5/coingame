import { useAnimate } from "framer-motion";

export const useTimerAnimations = () => {
  const [scope, animate] = useAnimate();

  const playAppearAnimation = () => {
    animate(scope.current, { scale: 0.5, opacity: 0 }, { duration: 0 });
    animate(
      scope.current,
      { scale: 1, opacity: 1 },
      { delay: 0.3, duration: 0.5, type: "spring", bounce: 0.4 }
    );
  };

  const playBaloonPopAnimation = async () => {
    const startMagnitude = 0.2;
    const endMagnitude = 1.2;
    const numberOfCycles = 10;
    const xKeyframes = [0];

    for (let i = 0; i < numberOfCycles; i++) {
      const progress = numberOfCycles > 1 ? i / (numberOfCycles - 1) : 1;
      const currentCycleMagnitude =
        startMagnitude + (endMagnitude - startMagnitude) * progress;

      xKeyframes.push(-currentCycleMagnitude);
      xKeyframes.push(currentCycleMagnitude);
    }
    xKeyframes.push(0);

    await animate(
      scope.current,
      {
        scale: 1.08,
        x: xKeyframes,
      },
      {
        duration: 0.75,
      }
    );

    // Second part of the animation: scale down
    await animate(scope.current, { scale: 0 }, { duration: 0.12 });
  };

  return {
    scope,
    playAppearAnimation,
    playBaloonPopAnimation,
  };
};
