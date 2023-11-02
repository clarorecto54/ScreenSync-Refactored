import { Dispatch, SetStateAction } from "react"
import { ParticipantsProps } from "./lobby.types"

/* -------- INTERFACE ------- */
export interface SessionProps {
    isHost: boolean
    participantList: ParticipantsProps[]
    mutedList: string[],
    setMutedList: Dispatch<SetStateAction<string[]>>
    isStreaming: boolean
    setIsStreaming: Dispatch<SetStateAction<boolean>>,
    isAnnotating: boolean
    setIsAnnotating: Dispatch<SetStateAction<boolean>>
}