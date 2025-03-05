import { colors, icons, getIcon, getColor } from "@/utils/iconUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "@/components/player/styles/IconCustomize.module.css";
import { useState } from "react";
import { useGameplayStore } from "@/store/gameplayStore";

interface IconCustomizeProps {
  icon: string;
  color: string;
  setIcon: (icon: string) => void;
  setColor: (color: string) => void;
}

export default function IconCustomize({
  icon,
  color,
  setIcon,
  setColor,
}: IconCustomizeProps) {
  const [showIcons, setShowIcons] = useState(false); // State to control icon visibility
  const { changeIcon } = useGameplayStore();

  const handleIconClick = (iconName: string) => {
    setIcon(iconName);
    changeIcon(iconName, color);
  };

  const handleColorClick = (colorName: string) => {
    setColor(colorName);
    changeIcon(icon, colorName);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Customize your icon</h2>
      <button onClick={() => setShowIcons(!showIcons)}>
        Toggle icon/color
      </button>
      {showIcons ? (
        <div className={styles.iconGrid}>
          {Object.keys(icons).map((iconName) => (
            <div
              key={iconName}
              className={`${styles.iconContainer} ${
                icon === iconName ? styles.selected : ""
              }`}
              onClick={() => handleIconClick(iconName)}>
              <FontAwesomeIcon
                icon={getIcon(iconName)}
                color={getColor(color)}
                size="2x"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.colorGrid}>
          {Object.keys(colors).map((colorName) => (
            <div
              key={colorName}
              className={`${styles.colorContainer} ${
                color === colorName ? styles.selected : ""
              }`}
              onClick={() => handleColorClick(colorName)}>
              <FontAwesomeIcon
                icon={getIcon(icon)}
                color={getColor(colorName)}
                size="2x"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
