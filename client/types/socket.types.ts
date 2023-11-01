import { Socket } from "socket.io-client"

/* -------- INTERFACE ------- */
export interface SocketProps {
    socket: Socket | null //? Socket IO Instance
    socketID: string
    IPv4: string
    isConnected: boolean //? Server Status
}