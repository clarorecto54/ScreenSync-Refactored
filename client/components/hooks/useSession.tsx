"use client"
import { SessionProps } from "@/types/session.types"
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
    isStreaming: false,
    setIsStreaming: () => { },
    isAnnotating: false,
    setIsAnnotating: () => { }
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
    const [isHost, setIsHost] = useState<boolean>(false)
    const [participantList, setParticipantList] = useState<ParticipantsProps[]>([
        { IPv4: "192.168.2.49", name: "Claro Recto", socketID: "eawfwefawf" },
        { IPv4: "192.168.2.49", name: "Sheila Mae Carmen", socketID: "asdfzxcfzd" },
        { IPv4: "192.168.2.49", name: "Claro Recto", socketID: "awefawyttghfg" },
        { IPv4: "192.168.2.49", name: "Sheila Mae Carmen", socketID: "zdxfaefawefad" },
        { IPv4: "192.168.2.49", name: "Claro Recto", socketID: "aedawefadfxcf" },
        { IPv4: "192.168.2.49", name: "Sheila Mae Carmen", socketID: "efaetdfgcfg" },
        { IPv4: "192.168.2.49", name: "Claro Recto", socketID: "adfaweffhch" },
        { IPv4: "192.168.2.49", name: "Sheila Mae Carmen", socketID: "aewfadfawefawfxxx" },
        { IPv4: "192.168.2.49", name: "Claro Recto", socketID: "awefawefsdfxcccvd" },
        { IPv4: "192.168.2.49", name: "Sheila Mae Carmen", socketID: "rgtyhdrtyuydfghdf" },
        { IPv4: "192.168.2.49", name: "Claro Recto", socketID: "wr2345hjbjb" },
        { IPv4: "192.168.2.49", name: "Sheila Mae Carmen", socketID: "cfaery86768" },
        { IPv4: "192.168.2.49", name: "Claro Recto", socketID: ",kjmghjthr" },
        { IPv4: "192.168.2.49", name: "Sheila Mae Carmen", socketID: "56457sgsdf" }
    ])
    const [mutedList, setMutedList] = useState<string[]>([])
    const [isStreaming, setIsStreaming] = useState<boolean>(false)
    const [isAnnotating, setIsAnnotating] = useState<boolean>(false)
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
        isStreaming: isStreaming, setIsStreaming,
        isAnnotating: isAnnotating, setIsAnnotating
    }}>
        {children}
    </SessionContext.Provider>
}