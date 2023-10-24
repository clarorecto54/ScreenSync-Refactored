"use client"
import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useState } from "react"
/* -------- INTERFACE ------- */
interface GlobalProps {
    username: string
    setUsername: Dispatch<SetStateAction<string>>
    meetingCode: string
    setMeetingCode: Dispatch<SetStateAction<string>>
}
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