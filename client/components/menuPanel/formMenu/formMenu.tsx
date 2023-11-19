import Button from "../../atom/button"
import Textbox from "../../atom/textbox"
import { useGlobals } from "../../hooks/useGlobals"
import { useLobby } from "../../hooks/useLobby"
import { useSocket } from "../../hooks/useSocket"
import { classMerge } from "../../utils"
import { v4 } from "uuid"
import { RoomInfo } from "@/types/lobby.types"
import { redirect, RedirectType } from "next/navigation"
import { useEffect } from "react"
export default function FormMenu() {
    /* ----- STATES & HOOKS ----- */
    const { //* GLOBAL VARIABLE HOOK
        username, setUsername,
        meetingCode, setMeetingCode
    } = useGlobals()
    const { //* LOBBY CONTEXT HOOK
        key, setKey
    } = useLobby()
    const { //* SOCKET CONTEXT HOOK
        socket, socketID, IPv4, isConnected
    } = useSocket()
    /* ----- EVENT HANDLING ----- */
    useEffect(() => {
        if (username.length > 3 && meetingCode && isConnected) {
            redirect(`/${meetingCode}`, RedirectType.replace) //? Redirect client to the meeting based on the info
        }
    }, [username, meetingCode, isConnected])
    /* -------- RENDERING ------- */
    return <form //* FORM
        className="h-full w-full px-[16px] flex flex-col gap-[16px]"
        onSubmit={(thisElement) => { //? What happens on submit
            thisElement.preventDefault()
        }}>
        <div //* INPUTS
            className="flex flex-col gap-[8px]">
            <Textbox //* USERNAME
                useIcon iconSrc="/[Icons] Participants.png"
                textSize={"small"} maxLength={32} value={username}
                placeholder="What is your name?"
                onChange={(thisElement) => {
                    setUsername(thisElement.target.value)
                }} />
            {username.length > 3 && <Textbox //* MEETING PASSCODE
                password
                useIcon iconSrc="/[Icons] Key.png"
                textSize={"small"} maxLength={32} value={key}
                placeholder="Session key here"
                onChange={(thisElement) => {
                    setKey(thisElement.target.value)
                }} />}
        </div>
        {username.length > 3 && <div //* CTA BUTTON
            className="flex gap-[8px] items-center justify-center">
            <Button //* START MEETING
                useIcon iconSrc="/[Icon] Join.png" iconOverlay
                textSize={"small"} type="submit"
                onClick={() => {
                    const generatedCode = v4()
                    const data: RoomInfo = { //? Starting the meeting
                        hostID: socketID,
                        hostIPv4: IPv4,
                        hostname: username,
                        meetingCode: generatedCode,
                        meetingKey: key,
                        participants: [{
                            IPv4: IPv4,
                            name: username,
                            socketID: socketID
                        }],
                        chatLog: [],
                        streamStatus: { isStreaming: false, streamerID: "" }
                    }
                    socket.emit("create-meeting", data)
                    setMeetingCode(generatedCode)
                }}
                className={classMerge(
                    "font-[600]", //? Font Styling
                    "hover:scale-95", //? Hover
                    "transition-all duration-500", //? Animation
                )}>
                Start Meeting
            </Button>
        </div>
        }
    </form >
}