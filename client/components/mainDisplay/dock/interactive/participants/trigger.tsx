import Button from "@/components/atom/button"
import { classMerge } from "@/components/utils"
import { useRef, useState, useEffect } from "react"
import ParticipantPopup from "./popup"
import { useSession } from "@/components/hooks/useSession"

export default function ParticipantsTrigger() {
    /* ----- STATES & HOOKS ----- */
    const { participantList, activePopup, setActivePopup } = useSession()
    const triggerRef = useRef<HTMLDivElement>(null)
    const [refHeight, setRefHeight] = useState<number>(0)
    /* ------- REF HANDLER ------ */
    useEffect(() => {
        if (triggerRef.current) {
            setRefHeight(triggerRef.current.getBoundingClientRect().height)
        }
    }, [triggerRef])
    /* -------- RENDERING ------- */
    return <div //* PARTICIPANTS CONTAINER
        className="flex justify-center items-end">
        <div //* TRIGGER REFERENCE
            ref={triggerRef}>
            <Button //* TRIGGER
                circle useIcon iconSrc="/images/Participants.svg" iconOverlay
                onClick={() => {
                    if (activePopup !== "participants") {
                        setActivePopup("participants")
                    }
                    else { setActivePopup("") }
                }}
                className={classMerge(
                    "bg-[#525252]", //? Background
                    "hover:bg-[#646464]", //? Hover
                    "font-[600]", //? Font
                )}>{participantList.length}</Button></div>
        {activePopup === "participants" && <div //* POPUP CONTAINER
            className="absolute"
            style={{
                translate: `0 -${refHeight + (16 + 8)}px`
            }}><ParticipantPopup /></div>
        }
    </div >
}