import styles from "./styles/SettingsPopup.module.css";
import { IconSettingsFilled } from "@tabler/icons-react";
import { Button, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useMantineTheme } from "@mantine/core";

const SettingsPopup = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const theme = useMantineTheme();

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
        yOffset={"10rem"}
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
          backgroundOpacity: 0.65,
          blur: 5,
        }}
      >
        <div className={styles.content}>
          <p>Options content goes here.</p>
        </div>
      </Modal>
    </div>
  );
};

export default SettingsPopup;
