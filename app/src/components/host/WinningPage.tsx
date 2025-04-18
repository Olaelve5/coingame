import { useConnectionStore } from "@/store/connectionStore";
import styles from "./styles/WinningPage.module.css";

export default function WinningPage() {
  const { game } = useConnectionStore();

  if (!game) return null;

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <h1 className={styles.title}>Winner is</h1>
        <h1 className={styles.winnerText}>{game.winner?.name}</h1>
      </div>
    </div>
  );
}
