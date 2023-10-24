import Button from "../atom/button"
import Textbox from "../atom/textbox"
import { useGlobals } from "../hooks/useGlobals"
import { useLobby } from "../hooks/useLobby"
import { classMerge } from "../utils"
import { v4 } from "uuid"
export default function FormMenu() {
    /* ----- STATES & HOOKS ----- */
    const { //* GLOBAL VARIABLE HOOK
        username, setUsername
    } = useGlobals()
    const { //* LOBBY CONTEXT HOOK
        addRoom,
        key, setKey
    } = useLobby()
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
                    addRoom(prevList => [...prevList, {
                        hostID: "HOSTID",
                        hostname: username,
                        meetingCode: v4(),
                        meetingKey: key,
                        participants: [{
                            IPv4: "1.1.1.1",
                            name: "localhost",
                            socketID: "xxx-xxx-xxx"
                        }]
                    }])
                }}
                className={classMerge(
                    "font-[600]", //? Font Styling
                    "hover:scale-95", //? Hover
                    "transition-all duration-500", //? Animation
                )}>
                Start Meeting
            </Button>
        </div>}
    </form>
}