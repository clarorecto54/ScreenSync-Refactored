import { Dispatch, SetStateAction } from "react"

/* -------- INTERFACE ------- */
export interface SessionProps {
    isStreaming: boolean
    setIsStreaming: Dispatch<SetStateAction<boolean>>,
    isAnnotating: boolean
    setIsAnnotating: Dispatch<SetStateAction<boolean>>
}