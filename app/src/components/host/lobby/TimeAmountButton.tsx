import { SegmentedControl } from "@mantine/core";
import { IconAlarmFilled } from "@tabler/icons-react";
import { useState } from "react";
import styles from "./styles/FastModeButton.module.css";
import { useMantineTheme } from "@mantine/core";
import { useGameSettingsStore } from "@/store/gameSettingsStore";
import { useSoundStore } from "@/store/soundStore";
import useSound from "use-sound";

const TimeAmountButton = () => {
  const { gameSettings, updateRoundTimeLimit } = useGameSettingsStore();
  const [value, setValue] = useState(gameSettings.roundTimeLimit.toString());
  const theme = useMantineTheme();
  const { getCalculatedEffectsVolume } = useSoundStore();
  const [playClickSound] = useSound("/sounds/click_2.mp3", {
    volume: getCalculatedEffectsVolume(),
  });

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <IconAlarmFilled size={24} color={theme.colors.pink[5]} />
        <h2>Time Limit</h2>
      </div>

      <SegmentedControl
        value={value}
        onChange={(value) => {
          setValue(value);
          updateRoundTimeLimit(parseInt(value));
          playClickSound();
        }}
        data={[
          { label: "20 sec", value: "20" },
          { label: "30 sec", value: "30" },
          { label: "40 sec", value: "40" },
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

export default TimeAmountButton;
