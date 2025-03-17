import { IconOctagonFilled, IconCircleFilled } from "@tabler/icons-react";
import styles from "../styles/CoinCircle.module.css";
import AnimatedDigit from "@/components/universal/AnimateDigit";
import { useGameplayStore } from "@/store/gameplayStore";

interface PlayerBetCoinsProps {
  coinsToBet: number;
  setCoinsToBet: (coins: number) => void;
}

export default function CoinCircle({
  coinsToBet,
  setCoinsToBet,
}: PlayerBetCoinsProps) {
  const { playCoins } = useGameplayStore();

  const handleClick = () => {
    if (coinsToBet > 0) {
      playCoins(coinsToBet);
      setCoinsToBet(0); // Reset after playing
    }
  };

  return (
    <div className={styles.container} onClick={handleClick}>
      <h2 className={styles.title}>Tap to play</h2>
      <div className={styles.circleContainer}>
        <IconCircleFilled className={styles.octagon} />
        <div className={styles.digitContainer}>
          {coinsToBet
            .toString()
            .split("")
            .map((digit, index) => (
              <AnimatedDigit key={index} value={digit} />
            ))}
        </div>
      </div>
    </div>
  );
}
