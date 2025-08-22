import { SegmentedControl } from "@mantine/core";
import { IconCoinFilled } from "@tabler/icons-react";
import { useState } from "react";
import styles from "./styles/FastModeButton.module.css";
import { useMantineTheme } from "@mantine/core";
import { useGameSettingsStore } from "@/store/gameSettingsStore";
import { useSoundStore } from "@/store/soundStore";
import useSound from "use-sound";

const CoinAmountButton = () => {
  const { gameSettings, updateInitialCoins } = useGameSettingsStore();
  const [value, setValue] = useState(gameSettings.initialCoins);
  const theme = useMantineTheme();
  const { getCalculatedEffectsVolume } = useSoundStore();
  const [playClickSound] = useSound("/sounds/click_2.mp3", {
    volume: getCalculatedEffectsVolume(),
  });

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <IconCoinFilled size={24} color={theme.colors.yellow[5]} />
        <h2>Initial Budget</h2>
      </div>

      <SegmentedControl
        value={value}
        onChange={(value) => {
          setValue(value);
          updateInitialCoins(value);
          playClickSound();
        }}
        data={[
          { label: "Low", value: "low" },
          { label: "Medium", value: "medium" },
          { label: "High", value: "high" },
        ]}
        classNames={{
          root: styles.segmentedControlRoot,
          label: styles.segmentedControlLabel,
          control: styles.segmentedControlControl,
          indicator: styles.indicator,
        }}
        size="md"
        radius="md"
        color="blue"
      />
    </div>
  );
};

export default CoinAmountButton;
