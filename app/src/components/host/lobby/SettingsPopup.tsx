import styles from "./styles/SettingsPopup.module.css";
import { IconSettingsFilled } from "@tabler/icons-react";
import { Button, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useMantineTheme } from "@mantine/core";
import FastModeButton from "./FastModeButton";
import CoinAmountButton from "./CoinAmountButton";
import TimeAmountButton from "./TimeAmountButton";
import ElimsPerRoundSlider from "./ ElimsPerRoundSlider";

const SettingsPopup = () => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <div className={styles.container}>
      <Button
        className={styles.button}
        leftSection={<IconSettingsFilled size={30} />}
        onClick={open}
        size="lg"
        radius="md"
      >
        <span>Options</span>
      </Button>

      <Modal
        opened={opened}
        onClose={close}
        title="Options"
        withCloseButton={false}
        size={"lg"}
        centered
        lockScroll={false}
        classNames={{
          root: styles.modal,
          title: styles.modalTitle,
          header: styles.modalHeader,
          body: styles.modalBody,
          close: styles.closeButton,
          content: styles.modalContent,
          inner: styles.modalInner,
        }}
        transitionProps={{
          transition: "fade",
          duration: 300,
          timingFunction: "ease",
        }}
        overlayProps={{
          backgroundOpacity: 0.75,
          blur: 5,
        }}
      >
        <div className={styles.contentRow}>
          <CoinAmountButton />
          <TimeAmountButton />
        </div>
        <div className={styles.contentRow}>
          <ElimsPerRoundSlider />
          <FastModeButton />
        </div>
      </Modal>
    </div>
  );
};

export default SettingsPopup;
