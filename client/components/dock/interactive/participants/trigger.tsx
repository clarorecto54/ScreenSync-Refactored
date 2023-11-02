import Button from "@/components/atom/button"
import { classMerge } from "@/components/utils"
import { useRef, useState, useEffect } from "react"
import ParticipantPopup from "./popup"
import { useSession } from "@/components/hooks/useSession"

export default function ParticipantsTrigger() {
    /* ----- STATES & HOOKS ----- */
    const { participantList } = useSession()
    const triggerRef = useRef<HTMLDivElement>(null)
    const [refHeight, setRefHeight] = useState<number>(0)
    const [showPopup, setShowPopup] = useState<boolean>(false)
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
                circle useIcon iconSrc="/[Icons] Participants.png" iconOverlay
                onClick={() => setShowPopup(!showPopup)}
                className={classMerge(
                    "bg-[#525252]", //? Background
                    "hover:bg-[#646464]", //? Hover
                    "font-[600]", //? Font
                )}>{participantList.length}</Button></div>
        {showPopup && <div //* POPUP CONTAINER
            className="absolute"
            style={{
                translate: `0 -${refHeight + (16 + 8)}px`
            }}><ParticipantPopup /></div>
        }
    </div >
}