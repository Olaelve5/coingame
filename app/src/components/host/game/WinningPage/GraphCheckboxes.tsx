import { Checkbox } from "@mantine/core";

interface GraphCheckboxesProps {
  showPlayerBets: boolean;
  showAverageCoins: boolean;
  setShowPlayerBets: (value: boolean) => void;
  setShowAverageCoins: (value: boolean) => void;
}

function GraphCheckboxes({ showPlayerBets, showAverageCoins, setShowPlayerBets, setShowAverageCoins }: GraphCheckboxesProps) {
  return (
    <div style={{width: '100%', display: 'flex', justifyContent: 'space-between', marginTop: 10}}>
      <Checkbox
        checked={showPlayerBets}
        label="Show Player Bets"
        color="teal.5"
        onChange={(event) => setShowPlayerBets(event.currentTarget.checked)}
      />
      <Checkbox
        checked={showAverageCoins}
        label="Show Average Budget"
        color={"orange.5"}
        onChange={(event) => setShowAverageCoins(event.currentTarget.checked)}
      />
    </div>
  );
}

export default GraphCheckboxes;
