import { Socket } from "socket.io-client"

/* -------- INTERFACE ------- */
export interface SocketProps {
    socket: Socket
    socketID: string
    IPv4: string
    isConnected: boolean
}