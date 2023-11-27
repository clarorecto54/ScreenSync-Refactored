import { Dispatch, SetStateAction, RefObject } from "react"
import { ParticipantsProps } from "./lobby.types"
import { MediaConnection } from "peerjs";
import { HostLineProps } from "./annotation.types";
/* -------- INTERFACE ------- */
export interface SessionProps {
    isViewer: boolean
    setIsViewer: Dispatch<SetStateAction<boolean>>
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
    stream: MediaStream | undefined
    setStream: Dispatch<SetStateAction<MediaStream | undefined>>
    fullscreen: boolean
    setFullscreen: Dispatch<SetStateAction<boolean>>
    isAnnotating: boolean
    setIsAnnotating: Dispatch<SetStateAction<boolean>>
    hostline: HostLineProps | null
    setHostLine: Dispatch<SetStateAction<HostLineProps | null>>
    clearCanvas: boolean
    setClearCanvas: Dispatch<SetStateAction<boolean>>
    annotationRatio: number
    setAnnotationRatio: Dispatch<SetStateAction<number>>
    brushSize: number
    setBrushSize: Dispatch<SetStateAction<number>>
    brushColor: string
    setBrushColor: Dispatch<SetStateAction<string>>
    activePopup: string
    setActivePopup: Dispatch<SetStateAction<string>>
    newMessage: boolean
    setNewMessage: Dispatch<SetStateAction<boolean>>
    clientLeaved: boolean
    setClientLeaved: Dispatch<SetStateAction<boolean>>
    singleCall: MediaConnection | undefined
    setSingleCall: Dispatch<SetStateAction<MediaConnection | undefined>>
    peerCall: MediaConnection[]
    setPeerCall: Dispatch<SetStateAction<MediaConnection[]>>
}
export interface MessageProps {
    sender: string
    senderID: string
    time: string
    message: string | string[]
}