import { Group, Button } from "@mantine/core";
import { useState } from "react";
import styles from "./styles/ElimsPerRoundSlider.module.css";
import { IconGhost2Filled } from "@tabler/icons-react";
import { useMantineTheme } from "@mantine/core";
import { useGameSettingsStore } from "@/store/gameSettingsStore";
import { useConnectionStore } from "@/store/connectionStore";
import { useSoundStore } from "@/store/soundStore";
import useSound from "use-sound";

const ElimsPerRoundSelect = () => {
  const { game } = useConnectionStore();
  const { gameSettings, updateElimsPerRound } = useGameSettingsStore();
  const [value, setValue] = useState(gameSettings.elimsPerRound);
  const theme = useMantineTheme();
  const { getCalculatedEffectsVolume } = useSoundStore();
  const [playClickSound] = useSound("/sounds/click_1.mp3", {
    volume: getCalculatedEffectsVolume(),
  });

  const activePlayers = game?.players.filter((player) => player.connected) || [];
  const maxElims = Math.max(activePlayers.length - 2, 1);

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <IconGhost2Filled size={24} color={theme.colors.teal[4]} />
        <h2>Round Eliminations</h2>
      </div>
      <Group wrap="nowrap" className={styles.buttonGroup}>
        <Button
          className={styles.button}
          disabled={value <= 1}
          radius={"md"}
          onClick={() => {
            setValue((prev) => Math.max(prev - 1, 1));
            updateElimsPerRound(Math.max(value - 1, 1));
            playClickSound();
          }}
        >
          -
        </Button>
        <span>{value}</span>
        <Button
          className={styles.button}
          disabled={value >= maxElims}
          radius={"md"}
          onClick={() => {
            setValue((prev) => Math.min(prev + 1, maxElims));
            updateElimsPerRound(Math.min(value + 1, maxElims));
            playClickSound();
          }}
        >
          +
        </Button>
      </Group>
    </div>
  );
};

export default ElimsPerRoundSelect;
