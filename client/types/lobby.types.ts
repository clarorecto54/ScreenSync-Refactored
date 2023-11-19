import { Dispatch, SetStateAction } from "react"
import { MessageProps } from "./session.types"

/* -------- INTERFACE ------- */
export interface ParticipantsProps {
    name: string
    socketID: string
    IPv4: string
}
export interface RoomInfo {
    hostname: string
    hostID: string
    hostIPv4: string
    meetingCode: string
    meetingKey: string
    participants: ParticipantsProps[]
    chatLog: MessageProps[]
    streamStatus: { isStreaming: boolean, streamerID: string }
}
export interface LobbyProps {
    searchRoom: string
    setSearchRoom: Dispatch<SetStateAction<string>>
    roomList: RoomInfo[]
    setRoomList: Dispatch<SetStateAction<RoomInfo[]>>
    key: string
    setKey: Dispatch<SetStateAction<string>>
}