import Peer from "peerjs"
import { Socket } from "socket.io-client"

/* -------- INTERFACE ------- */
export interface SocketProps {
    peer: Peer | undefined
    socket: Socket
    socketID: string
    IPv4: string
    isConnected: boolean
}