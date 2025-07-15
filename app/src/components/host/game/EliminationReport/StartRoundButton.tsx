import { IconPlayerPlay } from "@tabler/icons-react";
import { Button } from "@mantine/core";
import styles from "./styles/StartRoundButton.module.css";

const StartRoundButton = () => {
  return (
    <div className={styles.container}>
      <Button
        rightSection={<IconPlayerPlay />}
        variant="filled"
        size="md"
        fullWidth
      >
        Start Next Round
      </Button>
    </div>
  );
};

export default StartRoundButton;
