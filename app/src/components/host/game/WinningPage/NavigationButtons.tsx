import { Button } from "@mantine/core";
import { IconCirclePlusFilled, IconHomeFilled } from "@tabler/icons-react";
import styles from "./styles/NavigationButtons.module.css";

const NewGameButton = () => {
  return (
    <div className={styles.container}>
      <Button
        className={styles.button}
        leftSection={<IconHomeFilled size={30} className={styles.icon} stroke={1.5} />}
      >
        Return back home
      </Button>
      <Button
        className={styles.button}
        leftSection={<IconHomeFilled size={30} className={styles.icon} stroke={1.5} />}
      >
        Return back home
      </Button>
    </div>
  );
};

export default NewGameButton;
