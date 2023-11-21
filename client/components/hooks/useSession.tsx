"use client"
import { MessageProps, SessionProps } from "@/types/session.types"
import { ReactNode, createContext, useContext, useEffect, useState, useRef, MutableRefObject } from "react"
import { useGlobals } from "./useGlobals"
import { redirect, RedirectType } from "next/navigation"
import { ParticipantsProps } from "@/types/lobby.types"
import { useSocket } from "./useSocket"
import { MediaConnection } from "peerjs"
import { transformSDP } from "../utils.sdp"
/* --------- CONTEXT -------- */
const SessionContext = createContext<SessionProps>({
    isViewer: false,
    setIsViewer: () => { },
    isHost: false,
    streamRequest: { id: "", name: "" },
    streamAccess: false,
    setStreamAccess: () => { },
    participantList: [],
    mutedList: [],
    setMutedList: () => { },
    chatLog: [],
    isStreaming: false,
    setIsStreaming: () => { },
    muteStream: false,
    setMuteStream: () => { },
    stream: undefined,
    setStream: () => { },
    isAnnotating: false,
    setIsAnnotating: () => { },
    activePopup: "",
    setActivePopup: () => { },
    newMessage: false,
    setNewMessage: () => { },
    clientLeaved: false,
    setClientLeaved: () => { },
    singleCall: undefined,
    setSingleCall: () => { },
    peerCall: [],
    setPeerCall: () => { },
})
/* ------- CUSTOM HOOK ------ */
export function useSession() { return useContext(SessionContext) }
/* ---- CONTEXT PROVIDER ---- */
export function SessionContextProvider({ children }: { children: ReactNode }) {
    /* ----- STATES & HOOKS ----- */
    const { socket, socketID, peer } = useSocket()
    const {
        username, setUsername,
        meetingCode, setMeetingCode
    } = useGlobals()
    const [isViewer, setIsViewer] = useState<boolean>(false)
    const [isHost, setIsHost] = useState<boolean>(false)
    const [streamRequest, setStreamRequest] = useState<{ id: string, name: string }>({ id: "", name: "" })
    const [streamAccess, setStreamAccess] = useState<boolean>(false)
    const [participantList, setParticipantList] = useState<ParticipantsProps[]>([])
    const [mutedList, setMutedList] = useState<string[]>([])
    const [chatLog, setChatLog] = useState<MessageProps[]>([])
    const [isStreaming, setIsStreaming] = useState<boolean>(false)
    const [muteStream, setMuteStream] = useState<boolean>(false)
    const [stream, setStream] = useState<MediaStream | undefined>(undefined)
    const [isAnnotating, setIsAnnotating] = useState<boolean>(false)
    const [activePopup, setActivePopup] = useState<string>("")
    const [newMessage, setNewMessage] = useState<boolean>(false)
    const [clientLeaved, setClientLeaved] = useState<boolean>(false)
    const [singleCall, setSingleCall] = useState<MediaConnection | undefined>(undefined)
    const [peerCall, setPeerCall] = useState<MediaConnection[]>([])
    /* ---- SESSION VALIDATOR --- */
    useEffect(() => {
        if (!username || username.length < 4 || !meetingCode || (meetingCode !== window.location.pathname.replace("/", ""))) {
            setUsername("") //? Clear out client fake info
            setMeetingCode("") //? Clear out client fake info
            redirect("/", RedirectType.replace) //? Redirect client to the landing page if their credentials are not valid
        }
    }, [username, setUsername, meetingCode, setMeetingCode])
    /* --- SOCKET API HANDLING -- */
    useEffect(() => {
        //* EMIT (REQUEST)
        socket.emit("check-host", username, meetingCode) //? Check if host
        socket.emit("get-chatLog", meetingCode) //? Get room's chat log
        socket.emit("get-participant-list") //? Get participant list
        //* ON (RESPONSE)
        socket.on("late-comer", (joinerID) => {
            if (peer && stream) {
                setPeerCall(prevCall => [...prevCall, peer.call(joinerID, stream)])
                socket.emit("late-comer", joinerID)
            }
        })
        socket.on("view-status", (streamStatus: boolean) => {
            if (streamStatus) { //? If someone is streaming
                setMuteStream(false)
                setIsViewer(true)
            } else { //? If no one is streaming
                if (stream) { stream.getTracks().forEach(track => track.stop()) }
                setIsViewer(false)
                setIsStreaming(false)
                setStream(undefined)
                setStreamAccess(false)
            }
        })
        socket.on("get-stream-access", (id: string, username: string) => {
            setStreamRequest({ id: id, name: username })
            setActivePopup("System Access")
        })
        socket.on("grant-stream-access", () => setStreamAccess(true))
        socket.on("updated-chatLog", (data: MessageProps[]) => {
            setChatLog(data) //? Update the chat log from the server's data
        })
        socket.on("new-message", () => {
            if (activePopup !== "chats") {
                setNewMessage(true) //? Turns the notification icon of chat trigger
            }
        })
        socket.on("updated-participant-list", (data: ParticipantsProps[]) => {
            setParticipantList(data)
        })
        socket.on("alert-participant", () => {
            setActivePopup("System Alert")
        })
        socket.on("kick-participant", () => {
            setActivePopup("System Kick")
        })
        socket.on("host-authority", () => setIsHost(true))
    }, [socket, meetingCode, activePopup, username, stream, peer])
    /* ------ PEER HANDLING ----- */
    useEffect(() => {
        peer?.on("call", call => {
            setSingleCall(call)
            call.answer(undefined, { sdpTransform: transformSDP })
            call.on("stream", livestream => {
                livestream.getTracks().forEach(track => {
                    track.addEventListener("ended", () => {
                        setIsViewer(false)
                        setStream(undefined)
                        setIsStreaming(false)
                        setStreamAccess(false)
                    })
                })
                setIsViewer(true)
                setStream(livestream)
                setIsStreaming(true)
            })
            call.on("close", () => {
                setIsViewer(false)
                setStream(undefined)
                setIsStreaming(false)
                setStreamAccess(false)
            })
        })
    }, [peer])
    /* ------ EVENT HANDLER ----- */
    useEffect(() => {
        if (clientLeaved) {
            if (peerCall.length > 0 && (isHost || streamAccess)) {
                socket.emit("change-stream-status", meetingCode, false)
                peerCall.forEach(call => call.close())
            }
            if (stream) {
                stream.getTracks().forEach(track => track.stop())
            }
            if (isStreaming && (isHost || streamAccess)) {
                socket.emit("change-stream-status", meetingCode, false)
            }
            setStream(undefined)
            setIsStreaming(false)
            socket.emit("leave-room", username, meetingCode) //? Leave room from the server
            setUsername("") //? Clear out client info to get access on the landing page
            setMeetingCode("") //? Clear out client info to get access on the landing page
            redirect("/", RedirectType.replace) //? Redirect client to the landing page
        }
    }, [clientLeaved, socket, username, meetingCode, peerCall, stream, setUsername, setMeetingCode, streamAccess, isHost, isStreaming])
    /* -------- RENDERING ------- */
    return <SessionContext.Provider value={{
        isViewer: isViewer, setIsViewer,
        isHost: isHost,
        streamRequest: streamRequest,
        streamAccess: streamAccess, setStreamAccess,
        participantList: participantList,
        mutedList: mutedList, setMutedList,
        chatLog: chatLog,
        isStreaming: isStreaming, setIsStreaming,
        muteStream: muteStream, setMuteStream,
        stream: stream, setStream,
        isAnnotating: isAnnotating, setIsAnnotating,
        activePopup: activePopup, setActivePopup,
        newMessage: newMessage, setNewMessage,
        clientLeaved: clientLeaved, setClientLeaved,
        singleCall: singleCall, setSingleCall,
        peerCall: peerCall, setPeerCall,
    }}>
        {children}
    </SessionContext.Provider>
}