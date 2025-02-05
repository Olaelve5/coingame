import { io } from "socket.io-client";

// Connect to your backend URL
export const socket = io("http://localhost:3001", {
  autoConnect: false, // Connect manually after component mounts
});