"use client"
import { ReactNode, createContext, useContext } from "react"
/* -------- INTERFACE ------- */
interface GlobalProps {
    username: string
    meetingCode: string
}
/* --------- CONTEXT -------- */
const GlobalContext = createContext<GlobalProps>({
    username: "",
    meetingCode: ""
})
/* ------- CUSTOM HOOK ------ */
export function useGlobals() { return useContext(GlobalContext) }
/* ---- CONTEXT PROVIDER ---- */
export function GlobalContextProvider({ children }: { children: ReactNode }) {
    return <GlobalContext.Provider value={{
        username: "",
        meetingCode: ""
    }}>
        {children}
    </GlobalContext.Provider>
}