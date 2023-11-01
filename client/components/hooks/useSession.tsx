"use client"
import { SessionProps } from "@/types/session.types"
import { ReactNode, createContext, useContext, useEffect, useState } from "react"
import { useGlobals } from "./useGlobals"
import { redirect, RedirectType } from "next/navigation"
// TODO SESSIONS CHAT & ATTENDANCE SYSTEM
/* --------- CONTEXT -------- */
const SessionContext = createContext<SessionProps>({
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
    const [isStreaming, setIsStreaming] = useState<boolean>(false)
    const [isAnnotating, setIsAnnotating] = useState<boolean>(false)
    /* ------ EVENT HANDLER ----- */
    useEffect(() => {
        // TODO MAKE A PING CHECK FOR EXCESS PARTICIPANT WHEN DISCONNECTED/REFRESHED/INVALID
        if (!username || username.length < 4 || !meetingCode || (meetingCode !== window.location.pathname.replace("/", ""))) {
            setUsername("") //? Clear out client fake info
            setMeetingCode("") //? Clear out client fake info
            redirect("/", RedirectType.replace) //? Redirect client to the landing page if their credentials are not valid
        }
    }, [username, setUsername, meetingCode, setMeetingCode])
    /* -------- RENDERING ------- */
    return <SessionContext.Provider value={{
        isStreaming: isStreaming, setIsStreaming,
        isAnnotating: isAnnotating, setIsAnnotating
    }}>
        {children}
    </SessionContext.Provider>
}