import { classMerge } from "@/components/utils"
import { useEffect, useState } from "react"
import { redirect, RedirectType } from "next/navigation"
import Button from "@/components/atom/button"
import { useGlobals } from "@/components/hooks/useGlobals"
import { useSocket } from "@/components/hooks/useSocket"
/* ----- MAIN FUNCTIONS ----- */
export default function Dock() {
    /* ----- STATES & HOOKS ----- */
    const {
        username, setUsername,
        meetingCode, setMeetingCode
    } = useGlobals()
    const { socket } = useSocket()
    const [clientLeaved, setClientLeaved] = useState<boolean>(false)
    /* ------ EVENT HANDLER ----- */
    useEffect(() => {
        if (clientLeaved) {
            socket?.emit("leave-room", username, meetingCode) //? Leave room from the server
            setUsername("") //? Clear out client info to get access on the landing page
            setMeetingCode("") //? Clear out client info to get access on the landing page
            redirect("/", RedirectType.replace) //? Redirect client to the landing page
        }
    }, [clientLeaved, socket, username, meetingCode, setUsername, setMeetingCode])
    /* -------- RENDERING ------- */
    return <div //* APP DOCK
        className="flex gap-[16px] justify-center items-center">
        <Button //* ANNOTATION
            circle useIcon iconSrc="/[Icon] Annotations.png" iconOverlay
            className={classMerge(
                "bg-[#525252]", //? Background
                "hover:bg-[#646464]", //? Hover
            )} />
        <Button //* REACTIONS
            circle useIcon iconSrc="/[Icon] Reactions 2.png" iconOverlay
            className={classMerge(
                "bg-[#525252]", //? Background
                "hover:bg-[#646464]", //? Hover
            )} />
        <Button //* RAISE HAND
            circle useIcon iconSrc="/[Icon] Raise Hand.png" iconOverlay
            className={classMerge(
                "bg-[#525252]", //? Background
                "hover:bg-[#646464]", //? Hover
            )} />
        <Button //* MUTE
            circle useIcon iconSrc="/[Icon] Audio (2).png" iconOverlay
            className={classMerge(
                "bg-[#525252]", //? Background
                "hover:bg-[#646464]", //? Hover
            )} />
        <Button //* SHARE SCREEN
            circle useIcon iconSrc="/[Icon] Tabs.png" iconOverlay
            className={classMerge(
                "bg-[#525252]", //? Background
                "hover:bg-[#646464]", //? Hover
            )} />
        <Button //* END CALL
            onClick={() => setClientLeaved(true)}
            circle useIcon iconSrc="/[Icon] End Call.png" iconOverlay
            containerClass="w-[calc(32px*3)]" />
    </div>
}