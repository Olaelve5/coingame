// utils/socket.ts
import { io, Socket } from "socket.io-client";

// CHANGE TO:
const URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://192.168.1.48:3001";

let socket: Socket | null = null; //  IMPORTANT:  Starts as null

export const getSocket = () => {
    if (!socket) { // Only create a NEW socket if one doesn't exist
        socket = io(URL, { autoConnect: false }); // You can still use autoConnect: false
    }
    return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null; // IMPORTANT: Reset to null
  }
};