import { IconPlayerPlay } from "@tabler/icons-react";
import { Button } from "@mantine/core";
import styles from "./styles/StartRoundButton.module.css";
import { useGameplayStore } from "@/store/gameplayStore";

const StartRoundButton = ({ handleRoundPreparation }: { handleRoundPreparation: () => void }) => {
  const { startRound } = useGameplayStore();

  const handleClick = async () => {
    await startRound();
    handleRoundPreparation();
  };

  return (
    <div className={styles.container}>
      <Button
        rightSection={<IconPlayerPlay />}
        variant="filled"
        size="md"
        fullWidth
        onClick={handleClick}
      >
        Start Next Round
      </Button>
    </div>
  );
};

export default StartRoundButton;
