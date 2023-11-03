"use client"
import { MessageProps, SessionProps } from "@/types/session.types"
import { ReactNode, createContext, useContext, useEffect, useState } from "react"
import { useGlobals } from "./useGlobals"
import { redirect, RedirectType } from "next/navigation"
import { ParticipantsProps } from "@/types/lobby.types"
import { useSocket } from "./useSocket"
/* --------- CONTEXT -------- */
const SessionContext = createContext<SessionProps>({
    isHost: false,
    participantList: [],
    mutedList: [],
    setMutedList: () => { },
    chatLog: [],
    // setChatLog: () => {},
    isStreaming: false,
    setIsStreaming: () => { },
    isAnnotating: false,
    setIsAnnotating: () => { },
    activePopup: "",
    setActivePopup: () => { },
    newMessage: false,
    setNewMessage: () => { }
})
/* ------- CUSTOM HOOK ------ */
export function useSession() { return useContext(SessionContext) }
/* ---- CONTEXT PROVIDER ---- */
export function SessionContextProvider({ children }: { children: ReactNode }) {
    /* ----- STATES & HOOKS ----- */
    const { socket } = useSocket()
    const {
        username, setUsername,
        meetingCode, setMeetingCode
    } = useGlobals()
    const [isHost, setIsHost] = useState<boolean>(false) // TODO HOST AUTH
    const [participantList, setParticipantList] = useState<ParticipantsProps[]>([]) // TODO VIEWERS BACKEND
    const [mutedList, setMutedList] = useState<string[]>([])
    const [chatLog, setChatLog] = useState<MessageProps[]>([])
    const [isStreaming, setIsStreaming] = useState<boolean>(false)
    const [isAnnotating, setIsAnnotating] = useState<boolean>(false)
    const [activePopup, setActivePopup] = useState<string>("")
    const [newMessage, setNewMessage] = useState<boolean>(false)
    /* ---- SESSION VALIDATOR --- */
    useEffect(() => {
        // TODO [SERVER] ALWAYS CHECK CONNECTION AND DISCONNECT FOR LIST OF CLIENTS AND VALIDATE THE PARTICIPANT LIST OF EACH ROOM
        // if (!username || username.length < 4 || !meetingCode || (meetingCode !== window.location.pathname.replace("/", ""))) {
        //     setUsername("") //? Clear out client fake info
        //     setMeetingCode("") //? Clear out client fake info
        //     redirect("/", RedirectType.replace) //? Redirect client to the landing page if their credentials are not valid
        // }
    }, [username, setUsername, meetingCode, setMeetingCode])
    /* ------ API HANDLING ------ */
    useEffect(() => {
        //* EMIT (REQUEST)
        socket?.emit("get-chatLog", meetingCode)
        //* ON (RESPONSE)
        socket?.on("updated-chatLog", (data: MessageProps[]) => {
            setChatLog(data)
        })
        socket?.on("new-message", () => {
            if (activePopup !== "chats") {
                setNewMessage(true)
            }
        })
    }, [socket, meetingCode, activePopup])
    /* -------- RENDERING ------- */
    return <SessionContext.Provider value={{
        isHost: isHost,
        participantList: participantList,
        mutedList: mutedList, setMutedList,
        chatLog: chatLog,
        isStreaming: isStreaming, setIsStreaming,
        isAnnotating: isAnnotating, setIsAnnotating,
        activePopup: activePopup, setActivePopup,
        newMessage: newMessage, setNewMessage
    }}>
        {children}
    </SessionContext.Provider>
}