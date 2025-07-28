import { IconPlayerPlayFilled } from "@tabler/icons-react";
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
      <p>Start Next Round</p>
      <Button variant="filled" onClick={handleClick} className={styles.button}>
        <IconPlayerPlayFilled size={25} />
      </Button>
    </div>
  );
};

export default StartRoundButton;
