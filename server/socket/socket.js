import { connectionSocketHandler } from "./connectionSocket.js";
import { roundManageSocketHandler } from "./roundManageSocket.js";
import { gameplaySocketHandler } from "./gameplaySocket.js";

const socketHandler = (io) => {
  connectionSocketHandler(io);
  gameplaySocketHandler(io);
  roundManageSocketHandler(io);
};

export { socketHandler };
