import { IconPlayerPlay } from "@tabler/icons-react";
import { Button } from "@mantine/core";
import styles from "./styles/StartRoundButton.module.css";

const StartRoundButton = ({
  setShouldAnimateOut,
}: {
  setShouldAnimateOut: (shouldAnimate: boolean) => void;
}) => {

  const handleClick = async () => {
    setShouldAnimateOut(true);
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
