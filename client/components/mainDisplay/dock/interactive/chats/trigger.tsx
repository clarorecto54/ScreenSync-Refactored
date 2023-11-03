import Button from "@/components/atom/button";
import { classMerge } from "@/components/utils";
import { useEffect, useRef, useState } from "react";
import ChatsPopup from "./popup";
import { useSession } from "@/components/hooks/useSession";

export default function ChatsTrigger() {
    /* ----- STATES & HOOKS ----- */
    const {
        activePopup, setActivePopup,
        newMessage, setNewMessage
    } = useSession()
    const triggerRef = useRef<HTMLDivElement>(null)
    const [refHeight, setRefHeight] = useState<number>(0)
    /* ------- REF HANDER ------- */
    useEffect(() => {
        if (triggerRef.current) {
            setRefHeight(triggerRef.current.getBoundingClientRect().height)
        }
    }, [triggerRef])
    /* -------- RENDERING ------- */
    return <div //* CONTAINER
        className={classMerge(
            "flex justify-center items-end", //? Display
        )}>
        <div //* TRIGGER REFERENCE
            ref={triggerRef}>
            <Button //* TRIGGER
                useNotif={newMessage}
                circle useIcon iconSrc="/[Icon] Chat.png" iconOverlay
                onClick={() => {
                    if (activePopup !== "chats") {
                        setActivePopup("chats")
                        setNewMessage(false)
                    }
                    else { setActivePopup("") }
                }}
                className={classMerge(
                    "bg-[#525252]", //? Background
                    "hover:bg-[#646464]", //? Hover
                )} />
        </div>
        {activePopup === "chats" && <div //* POPUP CONTAINER
            className="absolute"
            style={{
                translate: `0 -${refHeight + (16 + 8)}px`
            }}>
            <ChatsPopup />
        </div>}
    </div>
}