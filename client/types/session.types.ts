import { Dispatch, SetStateAction, MutableRefObject, LegacyRef } from "react"
import { ParticipantsProps } from "./lobby.types"
import Peer from "peerjs"
/* -------- INTERFACE ------- */
export interface SessionProps {
    peer: Peer
    isHost: boolean
    streamRequest: {
        id: string;
        name: string;
    }
    streamAccess: boolean
    setStreamAccess: Dispatch<SetStateAction<boolean>>
    participantList: ParticipantsProps[]
    mutedList: string[]
    setMutedList: Dispatch<SetStateAction<string[]>>
    chatLog: MessageProps[]
    isStreaming: boolean
    setIsStreaming: Dispatch<SetStateAction<boolean>>
    muteStream: boolean
    setMuteStream: Dispatch<SetStateAction<boolean>>
    stream: MediaStream
    setStream: Dispatch<SetStateAction<MediaStream>>
    isAnnotating: boolean
    setIsAnnotating: Dispatch<SetStateAction<boolean>>
    activePopup: string
    setActivePopup: Dispatch<SetStateAction<string>>
    newMessage: boolean
    setNewMessage: Dispatch<SetStateAction<boolean>>
    clientLeaved: boolean
    setClientLeaved: Dispatch<SetStateAction<boolean>>
}
export interface MessageProps {
    sender: string
    senderID: string
    time: string
    message: string | string[]
}