import { IconCircleFilled } from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import styles from "../styles/CoinButtons.module.css";
import { Player } from "@/models/Game";

interface CoinButtonsProps {
  player: Player;
  coinsToBet: number;
  setCoinsToBet: (coins: number) => void;
}

export default function CoinButtons({
  player,
  coinsToBet,
  setCoinsToBet,
}: CoinButtonsProps) {
  const handleCoinsChange = (coins: number) => {
    if (coinsToBet + coins > player.coins) {
      setCoinsToBet(player.coins);
      return;
    }

    if (coinsToBet + coins < 1) {
      setCoinsToBet(1);
      return;
    }
    setCoinsToBet(coinsToBet + coins);
  };
  return (
    <div className={styles.buttonsContainer}>
      <div>
        <CoinButton
          coins={-5}
          handleCoinsChange={handleCoinsChange}
          innerButton={false}
        />
        <CoinButton
          coins={-1}
          handleCoinsChange={handleCoinsChange}
          innerButton={true}
        />
      </div>
      <div>
        <CoinButton
          coins={1}
          handleCoinsChange={handleCoinsChange}
          innerButton={true}
        />
        <CoinButton
          coins={5}
          handleCoinsChange={handleCoinsChange}
          innerButton={false}
        />
      </div>
    </div>
  );
}

function CoinButton({
  coins,
  handleCoinsChange,
  innerButton,
}: {
  coins: number;
  handleCoinsChange: (coins: number) => void;
  innerButton: boolean;
}) {
  const [animations, setAnimations] = useState<number[]>([]);

  const handleClick = () => {
    // Create a new unique animation ID
    const animId = Date.now();

    // Add this animation to the list
    setAnimations((prev) => [...prev, animId]);

    // Call the handler
    handleCoinsChange(coins);

    // Remove this animation after it completes
    setTimeout(() => {
      setAnimations((prev) => prev.filter((id) => id !== animId));
    }, 500); // Match this to animation duration
  };

  return (
    <motion.div
      className={styles.singleButtonContainer}
      onClick={handleClick}
      whileTap={{ scale: 0.95 }}>
      <IconCircleFilled
        size={64}
        className={
          innerButton ? styles.innerCoinButton : styles.outerCoinButton
        }
      />
      <div className={styles.coinButtonText}>
        <p>{coins > 0 ? "+" : coins < 0 ? "-" : ""}</p>
        <p>{Math.abs(coins).toString()}</p>
      </div>

      {/* Animated flying numbers */}
      <AnimatePresence>
        {animations.map((id) => (
          <motion.div
            key={id}
            className={styles.flyingNumber}
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 0, y: -100 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}>
            <p>
              {coins > 0 ? "+" : coins < 0 ? "-" : ""}
              {Math.abs(coins)}
            </p>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
