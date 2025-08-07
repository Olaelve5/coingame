import { Group, Button } from "@mantine/core";
import { useState } from "react";
import styles from "./styles/ElimsPerRoundSlider.module.css";
import { IconGhost2Filled, IconPlus, IconMinus } from "@tabler/icons-react";
import { useMantineTheme } from "@mantine/core";

const ElimsPerRoundSlider = () => {
  const [value, setValue] = useState(1);
  const theme = useMantineTheme();

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <IconGhost2Filled size={24} color={theme.colors.teal[4]} />
        <h2>Round Eliminations</h2>
      </div>
      <Group wrap="nowrap" className={styles.buttonGroup}>
        <Button radius={"md"} onClick={() => setValue((prev) => Math.max(prev - 1, 1))}>
          -
        </Button>
        <span>{value}</span>
        <Button radius={"md"} onClick={() => setValue((prev) => Math.min(prev + 1, 10))}>
          +
        </Button>
      </Group>
    </div>
  );
};

export default ElimsPerRoundSlider;
