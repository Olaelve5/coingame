import { IconHome, IconListNumbers } from "@tabler/icons-react";
import { Button } from "@mantine/core";
import styles from "./styles/PodiumButtons.module.css";
import { motion } from "framer-motion";

interface PodiumButtonsProps {
  showButtons: boolean;
}

const PodiumButtons = ({ showButtons }: PodiumButtonsProps) => {
  const handleHomeClick = () => {};

  const handleShowResultsClick = () => {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: showButtons ? 1 : 0,
        y: showButtons ? 0 : 20,
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={styles.container}
      style={{
        pointerEvents: showButtons ? "auto" : "none", // ✅ Disable clicks when hidden
      }}
    >
      <Button
        onClick={handleShowResultsClick}
        radius="md"
        size="md"
        leftSection={<IconListNumbers />}
        className={styles.button}
      >
        Final Rankings
      </Button>
      <Button
        onClick={handleHomeClick}
        radius="md"
        size="md"
        leftSection={<IconHome />}
        className={styles.button}
      >
        Home
      </Button>
    </motion.div>
  );
};

export default PodiumButtons;
