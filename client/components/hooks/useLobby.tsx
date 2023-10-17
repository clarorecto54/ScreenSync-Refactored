"use client"
import { createContext, useContext, ReactNode, useEffect, useState } from "react"
import { useSocket } from "./useSocket"
/* -------- INTERFACE ------- */
interface ParticipantsProps {
    name: string
    socketID: string
    IPv4: string
}
interface RoomInfo {
    hostname: string
    hostID: string
    meetingCode: string
    meetingKey: string
    participants: ParticipantsProps[]
}
interface LobbyProps {
    roomList: RoomInfo[]
}
/* --------- CONTEXT -------- */
const LobbyContext = createContext<LobbyProps>({
    roomList: []
})
/* ------- CUSTOM HOOK ------ */
export function useLobby() { return useContext(LobbyContext) }
/* ---- CONTEXT PROVIDER ---- */
export function LobbyContextProvider({ children }: { children: ReactNode }) {
    /* ----- STATES & HOOKS ----- */
    const { socket } = useSocket()
    /* ------ API HANDLING ------ */
    useEffect(() => {
        //? Socket listeners
        return () => { //* API CLEANUP
            //? Turn off the socket listeners
        }
    }, [socket])
    return <LobbyContext.Provider value={{
        roomList: [{
            hostname: "Claro",
            hostID: "test",
            meetingCode: "testmeeting",
            meetingKey: "",
            participants: [{ name: "Claro", socketID: "test", IPv4: "192.168.2.49" }]
        }]
    }}>
        {children}
    </LobbyContext.Provider>
}