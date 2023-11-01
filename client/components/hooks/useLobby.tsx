"use client"
import { createContext, useContext, ReactNode, useEffect, useState, SetStateAction, Dispatch } from "react"
import { useSocket } from "./useSocket"
import { LobbyProps, RoomInfo } from "@/types/lobby.types"
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
    const { socket, socketID } = useSocket()
    const [searchRoom, setSearchRoom] = useState<string>("")
    const [roomList, setRoomList] = useState<RoomInfo[]>([])
    const [key, setKey] = useState<string>("")
    /* ------ API HANDLING ------ */
    useEffect(() => {
        //* EMIT (REQUEST)
        socket?.emit("get-room-list")
        //* ON (RESPONSE)
        socket?.on("updated-room-list", (newRoomList: RoomInfo[]) => {
            setRoomList(newRoomList)
        })
    }, [socket, socketID])
    /* -------- PROVIDER -------- */
    return <LobbyContext.Provider value={{
        searchRoom: searchRoom, setSearchRoom,
        roomList: roomList, setRoomList,
        key: key, setKey
    }}>
        {children}
    </LobbyContext.Provider>
}