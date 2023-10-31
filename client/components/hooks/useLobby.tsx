"use client"
import { createContext, useContext, ReactNode, useEffect, useState, SetStateAction, Dispatch } from "react"
import { useSocket } from "./useSocket"
/* -------- INTERFACE ------- */
export interface ParticipantsProps {
    name: string
    socketID: string
    IPv4: string
}
export interface RoomInfo {
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
    setRoomList: Dispatch<SetStateAction<RoomInfo[]>>
    key: string
    setKey: Dispatch<SetStateAction<string>>
}
/* --------- CONTEXT -------- */
const LobbyContext = createContext<LobbyProps>({
    searchRoom: '',
    setSearchRoom: () => { },
    roomList: [],
    setRoomList: () => { },
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
    const [roomList, setRoomList] = useState<RoomInfo[]>([])
    const [key, setKey] = useState<string>("")
    /* ------ API HANDLING ------ */
    useEffect(() => {
        //? Socket listeners
        socket?.on("updated-room-list", (newRoomList: RoomInfo[]) => {
            setRoomList(newRoomList)
            console.log(`Updated Room List: ${newRoomList}`)
        })
    }, [socket])
    /* -------- PROVIDER -------- */
    return <LobbyContext.Provider value={{
        searchRoom: searchRoom, setSearchRoom,
        roomList: roomList, setRoomList,
        key: key, setKey
    }}>
        {children}
    </LobbyContext.Provider>
}