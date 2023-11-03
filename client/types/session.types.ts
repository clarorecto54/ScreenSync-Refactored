import { Dispatch, SetStateAction } from "react"
import { ParticipantsProps } from "./lobby.types"

/* -------- INTERFACE ------- */
export interface SessionProps {
    isHost: boolean
    participantList: ParticipantsProps[]
    mutedList: string[]
    setMutedList: Dispatch<SetStateAction<string[]>>
    chatLog: MessageProps[]
    // setChatLog: Dispatch<SetStateAction<MessageProps[]>>
    isStreaming: boolean
    setIsStreaming: Dispatch<SetStateAction<boolean>>
    isAnnotating: boolean
    setIsAnnotating: Dispatch<SetStateAction<boolean>>
    activePopup: string
    setActivePopup: Dispatch<SetStateAction<string>>
    newMessage: boolean
    setNewMessage: Dispatch<SetStateAction<boolean>>
}
export interface MessageProps {
    sender: string
    senderID: string
    time: string
    message: string | string[]
}