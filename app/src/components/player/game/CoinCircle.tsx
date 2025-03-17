import { IconOctagonFilled, IconCircleFilled } from "@tabler/icons-react";
import styles from "../styles/CoinCircle.module.css";
import AnimatedDigit from "@/components/universal/AnimateDigit";

interface PlayerBetCoinsProps {
  coinsToBet: number;
}

export default function CoinCircle({ coinsToBet }: PlayerBetCoinsProps) {
  return (
    <div className={styles.container}>
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
