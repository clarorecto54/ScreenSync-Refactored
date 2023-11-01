import { Dispatch, SetStateAction } from "react"

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
export interface LobbyProps {
    searchRoom: string
    setSearchRoom: Dispatch<SetStateAction<string>>
    roomList: RoomInfo[]
    setRoomList: Dispatch<SetStateAction<RoomInfo[]>>
    key: string
    setKey: Dispatch<SetStateAction<string>>
}