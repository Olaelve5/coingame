import { useConnectionStore } from "@/store/connectionStore";
import styles from "./styles/WinningPage.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getIcon, getColor } from "@/utils/iconUtils";

export default function WinningPage() {
  const { game } = useConnectionStore();

  if (!game) return null;

  const winnerObject = game.players.find((player) => player.id === game.winner?.id);

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <div className={styles.winnerContainer}>
          {winnerObject && (
            <FontAwesomeIcon
              icon={getIcon(winnerObject.icon)}
              color={getColor(winnerObject.color)}
              className={styles.winnerIcon}
            />
          )}
          <h1 className={styles.winnerText}>{game.winner?.name}</h1>
        </div>
      </div>
    </div>
  );
}
