import { io, Socket } from "socket.io-client";
import { SOCKET_URL } from "@/constants/api";

let socket: Socket | null = null;
let currentToken: string | null = null;

export const connectSocket = (token: string): Socket => {
  // If same token and already connected, reuse
  if (socket?.connected && currentToken === token) return socket;

  // Token changed or socket dead — tear down old one first
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }

  currentToken = token;
  socket = io(SOCKET_URL, {
    auth: { token },
    transports: ["websocket"],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    timeout: 10000,
  });

  return socket;
};

export const getSocket = (): Socket | null => socket;

export const disconnectSocket = (): void => {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
    currentToken = null;
  }
};
