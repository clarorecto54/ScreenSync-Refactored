"use client"
import { SocketProps } from "@/types/socket.types";
import { ReactNode, createContext, useEffect, useState, useContext } from "react";
import { Socket, io } from "socket.io-client"
/* --------- CONTEXT -------- */
const SocketContext = createContext<SocketProps>({
    //* DEFAULT VALUES
    socket: null,
    socketID: "",
    IPv4: "",
    isConnected: false
})
/* ------ ACCESSIBILITY ----- */
export function useSocket() { return useContext(SocketContext) }
/* -------- PROVIDER -------- */
export function SocketProvider({ children }: { children: ReactNode }) {
    const [server, setServer] = useState<string>("")
    const [socket, setSocket] = useState<Socket | null>(null)
    const [socketID, setSocketID] = useState<string>("")
    const [IPv4, setIPv4] = useState<string>("")
    const [isConnected, setIsConneted] = useState<boolean>(false)
    /* ----- SOCKET HANDLING ---- */
    useEffect(() => {
        fetch("/api/server", {
            method: "GET",
            cache: "no-store"
        }).then(res => res.text()).then(res => {
            const { IP, PORT } = JSON.parse(res)
            setServer(`http://${IP}:${PORT}`)
        })
        const socket = io(server)
        setSocket(socket)
        /* ------ API HANDLING ------ */
        socket.on("connect", () => setIsConneted(true))
        socket.on("disconnect", () => setIsConneted(false))
        socket.on("my-address", (myIPv4: string) => setIPv4(myIPv4))
        /* ----- SOCKET CLEANUP ----- */
        return () => {
            socket.disconnect()
        }
    }, [server])
    /* ----- EVENT HANDLING ----- */
    useEffect(() => {
        if (isConnected) {
            setSocketID(socket?.id || "")
            socket?.emit("req-address")
        }
    }, [socket, isConnected])
    /* -------- RENDERING ------- */
    return <SocketContext.Provider value={{
        socket: socket,
        socketID: socketID,
        IPv4: IPv4,
        isConnected: isConnected
    }}>
        {children}
    </SocketContext.Provider>
}