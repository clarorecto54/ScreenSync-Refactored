import { ReactNode, createContext, useContext } from "react"
/* -------- INTERFACE ------- */
interface SessionProps {
    isStreaming: boolean
    isAnnotating: boolean
}
/* --------- CONTEXT -------- */
const SessionContext = createContext<SessionProps>({
    isStreaming: false,
    isAnnotating: false
})
/* ------- CUSTOM HOOK ------ */
export function useSession() { return useContext(SessionContext) }
/* ---- CONTEXT PROVIDER ---- */
export function SessionContextProvider({ children }: { children: ReactNode }) {
    return <SessionContext.Provider value={{
        isStreaming: false,
        isAnnotating: false
    }}>
        {children}
    </SessionContext.Provider>
}