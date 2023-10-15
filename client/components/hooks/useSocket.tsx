import { ReactNode, createContext, useEffect, useState, useContext } from "react";
import { Socket, io } from "socket.io-client"
/* -------- INTERFACE ------- */
interface SocketProps {
    socket: Socket | null //? Socket IO Instance
    socketID: string
    isConnected: boolean //? Server Status
}
/* --------- CONTEXT -------- */
const SocketContext = createContext<SocketProps>({
    //* DEFAULT VALUES
    socket: null,
    socketID: "",
    isConnected: false
})
/* ------ ACCESSIBILITY ----- */
export function useSocket() { return useContext(SocketContext) }
/* -------- PROVIDER -------- */
export function SocketProvider({ children }: { children: ReactNode }) {
    const [socket, setSocket] = useState<Socket | null>(null)
    const [socketID, setSocketID] = useState<string>("")
    const [isConnected, setIsConneted] = useState<boolean>(false)
    useEffect(() => {
        const server = require("@/server.json")
        const socket = io(`http://${server.IP}:${server.PORT}`)
        setSocket(socket)
        /* ------ API HANDLING ------ */
        socket.on("connect", () => setIsConneted(true))
        socket.on("disconnect", () => setIsConneted(false))
        if (isConnected) { setSocketID(socket.id) }
        /* ----- SOCKET CLEANUP ----- */
        return () => {
            socket.disconnect()
        }
    }, [])
    return <SocketContext.Provider value={{
        socket: socket,
        socketID: socketID,
        isConnected: isConnected
    }}>
        {children}
    </SocketContext.Provider>
}