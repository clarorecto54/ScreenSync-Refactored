"use client"
import { MessageProps, SessionProps } from "@/types/session.types"
import { ReactNode, createContext, useContext, useEffect, useState } from "react"
import { useGlobals } from "./useGlobals"
import { redirect, RedirectType } from "next/navigation"
import { ParticipantsProps } from "@/types/lobby.types"
// TODO SESSIONS CHAT & ATTENDANCE SYSTEM
/* --------- CONTEXT -------- */
const SessionContext = createContext<SessionProps>({
    isHost: false,
    participantList: [],
    mutedList: [],
    setMutedList: () => { },
    chatLog: [],
    isStreaming: false,
    setIsStreaming: () => { },
    isAnnotating: false,
    setIsAnnotating: () => { },
    activePopup: "",
    setActivePopup: () => { }
})
/* ------- CUSTOM HOOK ------ */
export function useSession() { return useContext(SessionContext) }
/* ---- CONTEXT PROVIDER ---- */
export function SessionContextProvider({ children }: { children: ReactNode }) {
    /* ----- STATES & HOOKS ----- */
    const {
        username, setUsername,
        meetingCode, setMeetingCode
    } = useGlobals()
    const [isHost, setIsHost] = useState<boolean>(false) // TODO HOST AUTH
    const [participantList, setParticipantList] = useState<ParticipantsProps[]>([]) // TODO VIEWERS BACKEND
    const [mutedList, setMutedList] = useState<string[]>([])
    const [chatLog, setChatLog] = useState<MessageProps[]>([]) // TODO CHAT LOG BACKEND
    const [isStreaming, setIsStreaming] = useState<boolean>(false)
    const [isAnnotating, setIsAnnotating] = useState<boolean>(false)
    const [activePopup, setActivePopup] = useState<string>("")
    /* ---- SESSION VALIDATOR --- */
    useEffect(() => {
        // TODO [SERVER] ALWAYS CHECK CONNECTION AND DISCONNECT FOR LIST OF CLIENTS AND VALIDATE THE PARTICIPANT LIST OF EACH ROOM
        // if (!username || username.length < 4 || !meetingCode || (meetingCode !== window.location.pathname.replace("/", ""))) {
        //     setUsername("") //? Clear out client fake info
        //     setMeetingCode("") //? Clear out client fake info
        //     redirect("/", RedirectType.replace) //? Redirect client to the landing page if their credentials are not valid
        // }
    }, [username, setUsername, meetingCode, setMeetingCode])
    /* -------- RENDERING ------- */
    return <SessionContext.Provider value={{
        isHost: isHost,
        participantList: participantList,
        mutedList: mutedList, setMutedList,
        chatLog: chatLog,
        isStreaming: isStreaming, setIsStreaming,
        isAnnotating: isAnnotating, setIsAnnotating,
        activePopup: activePopup, setActivePopup
    }}>
        {children}
    </SessionContext.Provider>
}