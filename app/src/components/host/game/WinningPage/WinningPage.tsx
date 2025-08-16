import { useConnectionStore } from "@/store/connectionStore";
import styles from "./styles/WinningPage.module.css";
import PlayersAccordion from "./PlayersAccoridion";
import Podium from "./Podium";
import NewGameButton from "./NewGameButton";

export default function WinningPage() {
  const { game } = useConnectionStore();

  if (!game) return null;

  return (
    <div className={styles.container}>
      {/* <NewGameButton /> */}
      <Podium />
      <PlayersAccordion />
    </div>
  );
}
