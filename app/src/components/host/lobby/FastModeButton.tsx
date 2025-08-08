import { Group, Button, SegmentedControl } from "@mantine/core";
import { IconBoltFilled } from "@tabler/icons-react";
import { useState } from "react";
import styles from "./styles/FastModeButton.module.css"; // Assuming you have a CSS module for styling
import { useMantineTheme } from "@mantine/core";
import { useGameSettingsStore } from "@/store/gameSettingsStore";

const FastModeButton = () => {
  const { gameSettings, updateFastMode } = useGameSettingsStore();
  const [isFastMode, setIsFastMode] = useState(gameSettings.fastMode);
  const theme = useMantineTheme();

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <IconBoltFilled size={24} color={theme.colors.cyan[4]} />
        <h2>Fast Mode</h2>
      </div>

      <SegmentedControl
        value={isFastMode ? "enabled" : "disabled"}
        onChange={(value) => {
          setIsFastMode(value === "enabled");
          updateFastMode(value === "enabled");
        }}
        data={[
          { label: "Disabled", value: "disabled" },
          { label: "Enabled", value: "enabled" },
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

export default FastModeButton;
