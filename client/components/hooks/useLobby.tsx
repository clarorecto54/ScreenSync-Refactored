"use client"
import { createContext, useContext, ReactNode, useEffect, useState, SetStateAction, Dispatch } from "react"
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
    searchRoom: string
    setSearchRoom: Dispatch<SetStateAction<string>>
    roomList: RoomInfo[]
    addRoom: Dispatch<SetStateAction<RoomInfo[]>>
    key: string
    setKey: Dispatch<SetStateAction<string>>
}
/* --------- CONTEXT -------- */
const LobbyContext = createContext<LobbyProps>({
    searchRoom: '',
    setSearchRoom: () => { },
    roomList: [],
    addRoom: () => { },
    key: '',
    setKey: () => { }
})
/* ------- CUSTOM HOOK ------ */
export function useLobby() { return useContext(LobbyContext) }
/* ---- CONTEXT PROVIDER ---- */
export function LobbyContextProvider({ children }: { children: ReactNode }) {
    /* ----- STATES & HOOKS ----- */
    const { socket } = useSocket()
    const [searchRoom, setSearchRoom] = useState<string>("")
    const [roomList, addRoom] = useState<RoomInfo[]>([])
    const [key, setKey] = useState<string>("")
    /* ------ API HANDLING ------ */
    useEffect(() => {
        //? Socket listeners
        return () => { //* API CLEANUP
            //? Turn off the socket listeners
        }
    }, [socket])
    /* -------- PROVIDER -------- */
    return <LobbyContext.Provider value={{
        searchRoom: searchRoom, setSearchRoom,
        roomList: roomList, addRoom,
        key: key, setKey
    }}>
        {children}
    </LobbyContext.Provider>
}