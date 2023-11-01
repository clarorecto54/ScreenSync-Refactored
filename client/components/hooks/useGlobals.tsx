"use client"
import { GlobalProps } from "@/types/globals.types"
import { ReactNode, createContext, useContext, useState } from "react"
/* --------- CONTEXT -------- */
const GlobalContext = createContext<GlobalProps>({
    username: "",
    setUsername: () => { },
    meetingCode: "",
    setMeetingCode: () => { }
})
/* ------- CUSTOM HOOK ------ */
export function useGlobals() { return useContext(GlobalContext) }
/* ---- CONTEXT PROVIDER ---- */
export function GlobalContextProvider({ children }: { children: ReactNode }) {
    /* ----- STATES & HOOKS ----- */
    const [username, setUsername] = useState<string>('')
    const [meetingCode, setMeetingCode] = useState<string>("")
    /* -------- PROVIDER -------- */
    return <GlobalContext.Provider value={{
        username: username,
        setUsername,
        meetingCode: meetingCode,
        setMeetingCode
    }}>
        {children}
    </GlobalContext.Provider>
}