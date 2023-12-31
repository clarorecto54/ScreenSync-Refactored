"use client"
import { SocketProps } from "@/types/socket.types";
import Peer from "peerjs";
import { ReactNode, createContext, useEffect, useState, useContext, useRef } from "react";
import { Socket, io } from "socket.io-client"
/* --------- CONTEXT -------- */
const SocketContext = createContext<SocketProps>({
    peer: undefined,
    socket: io(),
    socketID: "",
    IPv4: "",
    isConnected: false
})
/* ------ ACCESSIBILITY ----- */
export function useSocket() { return useContext(SocketContext) }
/* -------- PROVIDER -------- */
export function SocketProvider({ children }: { children: ReactNode }) {
    const [peerConfig, setPeerConfig] = useState<{ IP: string, PORT: 0 }>({ IP: "", PORT: 0 })
    const [server, setServer] = useState<string>("")
    const [peer, setPeer] = useState<Peer | undefined>(undefined)
    const [socket, setSocket] = useState<Socket>(io())
    const [socketID, setSocketID] = useState<string>("")
    const [IPv4, setIPv4] = useState<string>("")
    const [isConnected, setIsConneted] = useState<boolean>(false)
    const prevPeerConfig = useRef<{ IP: string; PORT: number }>({ IP: "", PORT: 0 })
    /* ----- SOCKET HANDLING ---- */
    useEffect(() => {
        fetch("/api/server", {
            method: "GET",
            cache: "no-store"
        }).then(res => res.text()).then(res => {
            const { IP, PORT } = JSON.parse(res)
            setPeerConfig({ IP, PORT })
            setServer(`https://${IP}:${PORT}`)
        })
        const socket = io(server)
        setSocket(socket)
        setSocketID(socket.id)
        /* ------ API HANDLING ------ */
        //* EMIT (REQUEST)
        socket.emit("req-address")
        //* ON (RESPONSE)
        socket.on("connect", () => setIsConneted(true))
        socket.on("disconnect", () => setIsConneted(false))
        socket.on("my-address", (myIPv4: string) => setIPv4(myIPv4))
        /* ----- SOCKET CLEANUP ----- */
        return () => {
            socket.disconnect()
        }
    }, [server])
    /* ------ PEER HANDLING ----- */
    useEffect(() => {
        if (
            prevPeerConfig.current.IP !== peerConfig.IP ||
            prevPeerConfig.current.PORT !== peerConfig.PORT ||
            socket.id !== socketID
        ) {
            prevPeerConfig.current = { IP: peerConfig.IP, PORT: peerConfig.PORT }
        }
        if (socket.id) {
            setSocketID(socket.id)
            import("peerjs").then(({ default: Peer }) => {
                if (socketID && peerConfig.IP && peerConfig.PORT) { //? Make sure there's a socket id that the peer can use
                    setPeer(new Peer(socketID, {
                        path: "/",
                        host: peerConfig.IP,
                        port: peerConfig.PORT + 1,
                        secure: true,
                    }))
                }
            })
        }
    }, [socket, isConnected, socketID, peerConfig.IP, peerConfig.PORT])
    /* -------- RENDERING ------- */
    return <SocketContext.Provider value={{
        peer: peer,
        socket: socket,
        socketID: socketID,
        IPv4: IPv4,
        isConnected: isConnected
    }}>
        {children}
    </SocketContext.Provider>
}