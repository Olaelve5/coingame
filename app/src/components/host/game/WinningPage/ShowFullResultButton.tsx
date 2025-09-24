interface ShowFullResultButtonProps {
  onClick?: () => void;
}

const ShowFullResultButton = ({ onClick }: ShowFullResultButtonProps) => {
  return <button onClick={onClick}>Show Full Results</button>;
};

export default ShowFullResultButton;
