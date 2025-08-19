import {
  IconBrain,
  IconBoltFilled,
  IconTargetArrow,
  IconScale,
  IconCreditCardFilled,
} from "@tabler/icons-react";
import { Tooltip } from "@mantine/core";
import { useMantineTheme } from "@mantine/core";
import { Award } from "@/models/Game";

interface PlayerAward {
  award: Award;
}

const PlayerAward: React.FC<PlayerAward> = ({ award }) => {
  const theme = useMantineTheme();

  const id = award.id;

  const getIcon = () => {
    switch (id) {
      case "mastermind":
        return <IconBrain color={theme.colors.pink[5]} size={26} />;
      case "quick_draw":
        return <IconBoltFilled color={theme.colors.yellow[5]} size={26} />;
      case "high_roller":
        return <IconCreditCardFilled color={theme.colors.green[5]} size={26} />;
      case "cliffhanger":
        return <IconTargetArrow color={theme.colors.orange[5]} size={26} />;
      case "steady_hand":
        return <IconScale color={theme.colors.blue[4]} size={26} />;
    }
  };

  const getTooltipTitle = () => {
    switch (id) {
      case "mastermind":
        return "The Mastermind";
      case "quick_draw":
        return "The Quick Draw";
      case "high_roller":
        return "The High Roller";
      case "cliffhanger":
        return "The Cliffhanger";
      case "steady_hand":
        return "The Steady Hand";
    }
  };

  return (
    <Tooltip
      label={
        <div style={{ textAlign: "center" }}>
          <div style={{ fontWeight: "bold", marginBottom: 4 }}>{getTooltipTitle()}</div>
          <div style={{ fontSize: "0.875rem", opacity: 0.9 }}>{award.insight}</div>
        </div>
      }
      position="top"
      multiline
      withArrow
      w={250}
      color="rgba(47, 58, 68, 1)"
    >
      <div>{getIcon()}</div>
    </Tooltip>
  );
};

export default PlayerAward;
