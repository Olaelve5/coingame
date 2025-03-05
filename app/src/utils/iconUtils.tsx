import {
  faChessKnight,
  faDragon,
  faBiohazard,
  faBolt,
  faRocket,
  faUserAstronaut,
  faFireFlameCurved,
  faRobot,
  faDna,
  faCube,
  faVolcano,
  faPizzaSlice,
} from "@fortawesome/free-solid-svg-icons";

export const colors = {
  red: "#FF0000",        // hsl(0, 100%, 50%)
  orangeRed: "#FF6000",  // hsl(30, 100%, 50%)
  yellow: "#FFFF00",     // hsl(60, 100%, 50%)
  chartreuse: "#80FF00", // hsl(90, 100%, 50%)
  green: "#00FF00",      // hsl(120, 100%, 50%)
  springGreen: "#00FF80", // hsl(150, 100%, 50%)
  cyan: "#00FFFF",       // hsl(180, 100%, 50%)
  azure: "#0080FF",      // hsl(210, 100%, 50%)
  violet: "#8000FF",     // hsl(270, 100%, 50%)
  magenta: "#FF00FF",    // hsl(300, 100%, 50%)
  rose: "#FF0080",       // hsl(330, 100%, 50%)
  white: "#FFFFFF",      // White
};

export const icons = {
  astronaut: faUserAstronaut,
  dragon: faDragon,
  dna: faDna,
  rocket: faRocket,
  money: faBolt,
  robot: faRobot,
  fire: faFireFlameCurved,
  cube: faCube,
  biohazard: faBiohazard,
  knight: faChessKnight,
  volcano: faVolcano,
  pizza: faPizzaSlice,
};

export const getRandomIconKey = () => {
  const iconNames = Object.keys(icons);
  const randomIconName =
    iconNames[Math.floor(Math.random() * iconNames.length)];
  return randomIconName;
};

export const getRandomColorKey = () => {
  const colorNames = Object.keys(colors);
  const randomColorName =
    colorNames[Math.floor(Math.random() * colorNames.length)];
  return randomColorName;
};

export const getIcon = (iconName: string) => {
  const icon = icons[iconName as keyof typeof icons];
  if (!icon) {
    console.error(`Icon ${iconName} not found`);
    return icons["astronaut"]; // default icon
  }
  return icon;
};

export const getColor = (colorName: string) => {
  const color = colors[colorName as keyof typeof colors];
  if (!color) {
    console.error(`Color ${colorName} not found`);
    return colors["cyan"]; // default color
  }
  return color;
};

export const getNextIcon = (iconName: string) => {
  const iconNames = Object.keys(icons);
  const currentIndex = iconNames.indexOf(iconName);
  const nextIndex = (currentIndex + 1) % iconNames.length;
  return iconNames[nextIndex];
};

export const getNextColor = (colorName: string) => {
  const colorNames = Object.keys(colors);
  const currentIndex = colorNames.indexOf(colorName);
  const nextIndex = (currentIndex + 1) % colorNames.length;
  return colorNames[nextIndex];
};
