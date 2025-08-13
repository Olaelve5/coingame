import { useConnectionStore } from "@/store/connectionStore";
import styles from "./styles/WinningPage.module.css";
import PlayersAccordion from "./PlayersAccoridion";
import Podium from "./Podium";

export default function WinningPage() {
  const { game } = useConnectionStore();

  if (!game) return null;

  const winnerObject = game.players.find((player) => player.id === game.winner?.id);

  return (
    <div className={styles.container}>
      <Podium />
      <PlayersAccordion />
    </div>
  );
}
