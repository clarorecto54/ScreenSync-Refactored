"use client"
import { MessageProps, SessionProps } from "@/types/session.types"
import { ReactNode, createContext, useContext, useEffect, useState, useRef, MutableRefObject } from "react"
import { useGlobals } from "./useGlobals"
import { redirect, RedirectType } from "next/navigation"
import { ParticipantsProps } from "@/types/lobby.types"
import { useSocket } from "./useSocket"
import { Peer } from "peerjs"
// TODO PUT THE STREAM ON THE PEER FOR RTC
/* --------- CONTEXT -------- */
const SessionContext = createContext<SessionProps>({
    peer: new Peer(),
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
    stream: new MediaStream,
    setStream: () => { },
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
    const [peer, setPeer] = useState<Peer>(new Peer())
    const {
        username, setUsername,
        meetingCode, setMeetingCode
    } = useGlobals()
    const [isHost, setIsHost] = useState<boolean>(false)
    const [streamRequest, setStreamRequest] = useState<{ id: string, name: string }>({ id: "", name: "" })
    const [streamAccess, setStreamAccess] = useState<boolean>(false)
    const [participantList, setParticipantList] = useState<ParticipantsProps[]>([])
    const [mutedList, setMutedList] = useState<string[]>([])
    const [chatLog, setChatLog] = useState<MessageProps[]>([])
    const [isStreaming, setIsStreaming] = useState<boolean>(false)
    const [muteStream, setMuteStream] = useState<boolean>(false)
    const [stream, setStream] = useState<MediaStream>(new MediaStream())
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
            try {
                const { IP, PORT } = JSON.parse(res)
                const peer = new Peer(socketID, {
                    host: IP,
                    port: PORT + 1
                })
                setPeer(peer)
            } catch (error) { console.log(`Peer Error: ${error}`) }
        })
    }, [socket, socketID, meetingCode])
    /* --- SOCKET API HANDLING -- */
    useEffect(() => {
        //* EMIT (REQUEST)
        socket.emit("check-host", username, meetingCode) //? Check if host
        socket.emit("get-chatLog", meetingCode) //? Get room's chat log
        socket.emit("get-participant-list") //? Get participant list
        //* ON (RESPONSE)
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
    }, [socket, meetingCode, activePopup, username])
    /* ------ EVENT HANDLER ----- */
    useEffect(() => {
        if (clientLeaved) {
            setStream(new MediaStream())
            setIsStreaming(false)
            socket.emit("leave-room", username, meetingCode) //? Leave room from the server
            setUsername("") //? Clear out client info to get access on the landing page
            setMeetingCode("") //? Clear out client info to get access on the landing page
            peer.disconnect()
            redirect("/", RedirectType.replace) //? Redirect client to the landing page
        }
    }, [clientLeaved, socket, peer, username, meetingCode, setUsername, setMeetingCode])
    useEffect(() => {
        if (isStreaming) {
            stream.getTracks().forEach(track => { //? Stop Sharing Popup Handler
                track.addEventListener("ended", () => {
                    setStream(new MediaStream())
                    setIsStreaming(false)
                    setStreamAccess(false)
                })
            })
            stream.getTracks().forEach(track => { //? Track Modifications
                track.applyConstraints({
                    frameRate: { min: 60, max: 144, ideal: 144 },
                    channelCount: 1,
                    noiseSuppression: true,
                    echoCancellation: true,
                    sampleRate: { min: 44100, max: 192000, ideal: 88200 },
                    sampleSize: { min: 16, max: 24, ideal: 24 }
                })
            })
            stream.getVideoTracks().forEach(video => { //? Video Modifications
                video.applyConstraints({
                    frameRate: { min: 60, max: 144, ideal: 144 }
                })
            })
            stream.getAudioTracks().forEach(audio => { //? Audio Modifications
                audio.applyConstraints({
                    channelCount: 1,
                    noiseSuppression: true,
                    echoCancellation: true,
                    sampleRate: { min: 44100, max: 192000, ideal: 88200 },
                    sampleSize: { min: 16, max: 24, ideal: 24 }
                })
            })
        }
    }, [isStreaming, stream])
    /* -------- RENDERING ------- */
    return <SessionContext.Provider value={{
        peer: peer,
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
        clientLeaved: clientLeaved, setClientLeaved
    }}>
        {children}
    </SessionContext.Provider>
}