import { IconPlayerPlayFilled } from "@tabler/icons-react";
import { Button } from "@mantine/core";
import styles from "./styles/StartRoundButton.module.css";
import { useGameplayStore } from "@/store/gameplayStore";
import { start } from "repl";

const StartRoundButton = () => {
  const { startRound } = useGameplayStore();
  const handleClick = async () => {
    startRound();
  };

  return (
    <div className={styles.container}>
      <p>Start Next Round</p>
      <Button variant="filled" onClick={handleClick} className={styles.button}>
        <IconPlayerPlayFilled size={25} />
      </Button>
    </div>
  );
};

export default StartRoundButton;
