"use client"
import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useState } from "react"
/* -------- INTERFACE ------- */
interface SessionProps {
    isStreaming: boolean
    setIsStreaming: Dispatch<SetStateAction<boolean>>,
    isAnnotating: boolean
    setIsAnnotating: Dispatch<SetStateAction<boolean>>
}
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
    const [isStreaming, setIsStreaming] = useState<boolean>(false)
    const [isAnnotating, setIsAnnotating] = useState<boolean>(false)
    return <SessionContext.Provider value={{
        isStreaming: isStreaming, setIsStreaming,
        isAnnotating: isAnnotating, setIsAnnotating
    }}>
        {children}
    </SessionContext.Provider>
}