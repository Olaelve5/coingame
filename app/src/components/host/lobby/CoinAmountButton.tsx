import { SegmentedControl } from "@mantine/core";
import { IconCoinFilled } from "@tabler/icons-react";
import { useState } from "react";
import styles from "./styles/FastModeButton.module.css"; 
import { useMantineTheme } from "@mantine/core";

const CoinAmountButton = () => {
  const [value, setValue] = useState("medium");
  const theme = useMantineTheme();

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <IconCoinFilled size={24} color={theme.colors.yellow[5]} />
        <h2>Initial Budget</h2>
      </div>

      <SegmentedControl
        value={value}
        onChange={(value) => setValue(value)}
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
