"use client"
import { MessageProps, SessionProps } from "@/types/session.types"
import { ReactNode, createContext, useContext, useEffect, useState } from "react"
import { useGlobals } from "./useGlobals"
import { redirect, RedirectType } from "next/navigation"
import { ParticipantsProps } from "@/types/lobby.types"
import { useSocket } from "./useSocket"
import { Peer } from "peerjs"
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
    setActivePopup: () => { },
    newMessage: false,
    setNewMessage: () => { },
    clientLeaved: false,
    setClientLeaved: () => { }
})
/* ------- CUSTOM HOOK ------ */
export function useSession() { return useContext(SessionContext) }
/* ---- CONTEXT PROVIDER ---- */
export function SessionContextProvider({ children }: { children: ReactNode }) {
    /* ----- STATES & HOOKS ----- */
    const { socket, socketID } = useSocket()
    const [peer, setPeer] = useState<Peer>()
    const {
        username, setUsername,
        meetingCode, setMeetingCode
    } = useGlobals()
    const [isHost, setIsHost] = useState<boolean>(false) // TODO HOST AUTH
    const [participantList, setParticipantList] = useState<ParticipantsProps[]>([])
    const [mutedList, setMutedList] = useState<string[]>([])
    const [chatLog, setChatLog] = useState<MessageProps[]>([])
    const [isStreaming, setIsStreaming] = useState<boolean>(false)
    const [isAnnotating, setIsAnnotating] = useState<boolean>(false)
    const [activePopup, setActivePopup] = useState<string>("")
    const [newMessage, setNewMessage] = useState<boolean>(false)
    const [clientLeaved, setClientLeaved] = useState<boolean>(false)
    /* ---- SESSION VALIDATOR --- */
    useEffect(() => {
        if (!username || username.length < 4 || !meetingCode || (meetingCode !== window.location.pathname.replace("/", ""))) {
            setUsername("") //? Clear out client fake info
            setMeetingCode("") //? Clear out client fake info
            redirect("/", RedirectType.replace) //? Redirect client to the landing page if their credentials are not valid
        }
    }, [username, setUsername, meetingCode, setMeetingCode])
    /* ------ PEER HANDLING ----- */
    useEffect(() => {
        //* PEER INITIALIZATION
        fetch("/api/server", {
            method: "GET",
            cache: "no-store"
        }).then(res => res.text()).then(res => {
            const { IP, PORT } = JSON.parse(res)
            const peer = new Peer("", {
                host: IP,
                port: 3002
            })
            //* API
            peer.on("open", peerID => {
                socket?.emit("set-peer-id", meetingCode, socketID, peerID)
            })
            setPeer(peer)
        })
        return () => peer?.disconnect()
    }, [peer, socket, socketID, meetingCode])
    /* --- SOCKET API HANDLING -- */
    useEffect(() => {
        //* EMIT (REQUEST)
        socket?.emit("get-chatLog", meetingCode) //? Get room's chat log
        socket?.emit("get-participant-list") //? Get participant list
        //* ON (RESPONSE)
        socket?.on("updated-chatLog", (data: MessageProps[]) => {
            setChatLog(data) //? Update the chat log from the server's data
        })
        socket?.on("new-message", () => {
            if (activePopup !== "chats") {
                setNewMessage(true) //? Turns the notification icon of chat trigger
            }
        })
        socket?.on("updated-participant-list", (data: ParticipantsProps[]) => {
            setParticipantList(data)
        })
        socket?.on("alert-participant", () => {
            setActivePopup("System Alert")
        })
        socket?.on("kick-participant", () => {
            setActivePopup("System Kick")
        })
    }, [socket, meetingCode, activePopup])
    /* ------ EVENT HANDLER ----- */
    useEffect(() => {
        if (clientLeaved) {
            socket?.emit("leave-room", username, meetingCode) //? Leave room from the server
            setUsername("") //? Clear out client info to get access on the landing page
            setMeetingCode("") //? Clear out client info to get access on the landing page
            redirect("/", RedirectType.replace) //? Redirect client to the landing page
        }
    }, [clientLeaved, socket, username, meetingCode, setUsername, setMeetingCode])
    /* -------- RENDERING ------- */
    return <SessionContext.Provider value={{
        isHost: isHost,
        participantList: participantList,
        mutedList: mutedList, setMutedList,
        chatLog: chatLog,
        isStreaming: isStreaming, setIsStreaming,
        isAnnotating: isAnnotating, setIsAnnotating,
        activePopup: activePopup, setActivePopup,
        newMessage: newMessage, setNewMessage,
        clientLeaved: clientLeaved, setClientLeaved
    }}>
        {children}
    </SessionContext.Provider>
}