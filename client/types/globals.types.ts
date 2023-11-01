import { Dispatch, SetStateAction } from "react"

/* -------- INTERFACE ------- */
export interface GlobalProps {
    username: string
    setUsername: Dispatch<SetStateAction<string>>
    meetingCode: string
    setMeetingCode: Dispatch<SetStateAction<string>>
}