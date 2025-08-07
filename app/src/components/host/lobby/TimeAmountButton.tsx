import { SegmentedControl } from "@mantine/core";
import { IconAlarmFilled } from "@tabler/icons-react";
import { useState } from "react";
import styles from "./styles/FastModeButton.module.css";
import { useMantineTheme } from "@mantine/core";
import { useGameSettingsStore } from "@/store/gameSettingsStore";

const TimeAmountButton = () => {
  const { settings, updateTimeLimit } = useGameSettingsStore();
  const [value, setValue] = useState(settings.timeLimit.toString());
  const theme = useMantineTheme();

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
          updateTimeLimit(parseInt(value));
        }}
        data={[
          { label: "20 sec", value: "20" },
          { label: "40 sec", value: "40" },
          { label: "60 sec", value: "60" },
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
