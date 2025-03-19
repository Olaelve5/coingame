// utils/socket.ts
import { io, Socket } from "socket.io-client";
import { getApiBaseUrl } from "@/utils/apiUrlUtils";

let socket: Socket | null = null;

export const getSocket = () => {
    if (!socket) {
        const socketUrl = getApiBaseUrl();
        console.log(`Creating socket connection to: ${socketUrl}`);
        
        socket = io(socketUrl, { 
            autoConnect: false,
            transports: ['websocket', 'polling'],
            reconnectionAttempts: 5,
            timeout: 10000
        });
        
        // Add event listeners for debugging
        socket.on('connect', () => console.log('Socket connected successfully'));
        socket.on('connect_error', (err) => console.error('Socket connection error:', err));
    }
    return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null; // IMPORTANT: Reset to null
  }
};