import { Dispatch, SetStateAction } from "react"
import { MessageProps } from "./session.types"

/* -------- INTERFACE ------- */
export interface ParticipantsProps {
    name: string
    socketID: string
    peerID?: string
    IPv4: string
}
export interface RoomInfo {
    hostname: string
    hostID: string
    meetingCode: string
    meetingKey: string
    participants: ParticipantsProps[]
    chatLog: MessageProps[]
}
export interface LobbyProps {
    searchRoom: string
    setSearchRoom: Dispatch<SetStateAction<string>>
    roomList: RoomInfo[]
    setRoomList: Dispatch<SetStateAction<RoomInfo[]>>
    key: string
    setKey: Dispatch<SetStateAction<string>>
}