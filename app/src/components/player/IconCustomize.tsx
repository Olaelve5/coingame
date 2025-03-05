import { colors, icons, getIcon, getColor } from "@/utils/iconUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "@/components/player/styles/IconCustomize.module.css";
import { useGameplayStore } from "@/store/gameplayStore";
import { useState, useEffect } from "react";
import { faShuffle } from "@fortawesome/free-solid-svg-icons";

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
  const { changeIcon } = useGameplayStore();
  const iconKeys = Object.keys(icons);
  const colorKeys = Object.keys(colors);
  const [colorIndex, setColorIndex] = useState(0);
  const [selectedColorIndex, setSelectedColorIndex] = useState(-1);

  // Find the current color index for the selected icon
  useEffect(() => {
    if (icon && color) {
      const iconIndex = iconKeys.indexOf(icon);
      const colorIdx = colorKeys.indexOf(color);
      // Store the difference between colorIndex and this icon's color
      setSelectedColorIndex(mod(colorIdx - iconIndex, colorKeys.length));
    }
  }, [icon, color]);

  // Proper modulo that works with negative numbers
  const mod = (n: number, m: number) => ((n % m) + m) % m;

  // Assign a color to each icon consistently
  const getIconColor = (iconName: string) => {
    const iconIndex = iconKeys.indexOf(iconName);

    // If this is the selected icon and we have stored its color index
    if (iconName === icon && selectedColorIndex >= 0) {
      // Use the stored color index for the selected icon
      return colorKeys[mod(iconIndex + selectedColorIndex, colorKeys.length)];
    }

    // For all other icons, use the shifting color index
    return colorKeys[mod(iconIndex + colorIndex, colorKeys.length)];
  };
  const handleIconClick = (iconName: string) => {
    const iconColor = getIconColor(iconName);
    setIcon(iconName);
    setColor(iconColor);
    changeIcon(iconName, iconColor);
  };

  const handleShuffleColors = () => {
    // Update the color index
    setColorIndex((prev) => prev - 1);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Customize your icon</h2>

      <div className={styles.iconGrid}>
        {iconKeys.map((iconName) => {
          const iconColor = getIconColor(iconName);
          return (
            <div
              key={iconName}
              className={`${styles.iconContainer} ${
                icon === iconName ? styles.selectedIconContainer : ""
              }`}
              onClick={() => handleIconClick(iconName)}>
              <FontAwesomeIcon
                icon={getIcon(iconName)}
                color={getColor(iconColor)}
                size="xl"
              />
            </div>
          );
        })}
      </div>
      <button className={styles.shuffleButton} onClick={handleShuffleColors}>
        <FontAwesomeIcon
          icon={faShuffle}
          className={styles.shuffleIcon}
          size="xl"
        />
      </button>
    </div>
  );
}
