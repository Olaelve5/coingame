import { Player } from "@/models/Game";
import { getIcon, getColor } from "@/utils/iconUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoins } from "@fortawesome/free-solid-svg-icons";
import styles from "../styles/PlayerDetails.module.css";

export default function PlayerDetails({ player }: { player: Player }) {
  return (
    <div className={styles.container}>
      <div className={styles.nameIconContainer}>
        <FontAwesomeIcon
          icon={getIcon(player?.icon ?? "defaultIcon")}
          color={getColor(player?.color ?? "defaultColor")}
          size="lg"
        />
        <h2>{player?.name}</h2>
      </div>
      <div className={styles.coinsContainer}>
        <FontAwesomeIcon icon={faCoins} size="lg" className={styles.coinIcon} />
        <span>{player?.coins}</span>
      </div>
    </div>
  );
}
