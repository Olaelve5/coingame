import { Group, Button } from "@mantine/core";
import { useState } from "react";
import styles from "./styles/ElimsPerRoundSlider.module.css";
import { IconGhost2Filled } from "@tabler/icons-react";
import { useMantineTheme } from "@mantine/core";
import { useGameSettingsStore } from "@/store/gameSettingsStore";

const ElimsPerRoundSlider = () => {
  const { settings, updateElimsPerRound } = useGameSettingsStore();
  const [value, setValue] = useState(settings.elimsPerRound);
  const theme = useMantineTheme();

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <IconGhost2Filled size={24} color={theme.colors.teal[4]} />
        <h2>Round Eliminations</h2>
      </div>
      <Group wrap="nowrap" className={styles.buttonGroup}>
        <Button
          className={styles.button}
          radius={"md"}
          onClick={() => {
            setValue((prev) => Math.max(prev - 1, 1));
            updateElimsPerRound(Math.max(value - 1, 1));
          }}
        >
          -
        </Button>
        <span>{value}</span>
        <Button
          className={styles.button}
          radius={"md"}
          onClick={() => {
            setValue((prev) => Math.min(prev + 1, 10));
            updateElimsPerRound(Math.min(value + 1, 10));
          }}
        >
          +
        </Button>
      </Group>
    </div>
  );
};

export default ElimsPerRoundSlider;
