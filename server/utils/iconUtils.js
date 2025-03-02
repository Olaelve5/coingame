const iconNames = [
  "otter",
  "dragon",
  "ghost",
  "calculator",
  "rocket",
  "astronaut",
  "money",
  "fire",
  "robot",
  "dna",
  "cube",
  "volcano",
  "pizza",
];

const colorNames = [
  "cyan",
  "magenta",
  "lime",
  "yellow",
  "pink",
  "coral",
  "orange",
  "gold",
  "violet",
  "turquoise",
  "neonGreen",
  "hotPink",
];

export const getRandomIcon = () => {
  return iconNames[Math.floor(Math.random() * iconNames.length)];
};

export const getRandomColor = () => {
  return colorNames[Math.floor(Math.random() * colorNames.length)];
};


