import Button from "@/components/atom/button"
import { useGlobals } from "@/components/hooks/useGlobals"
import { useSocket } from "@/components/hooks/useSocket"
import { classMerge } from "@/components/utils"
import { useState, useRef, useEffect } from "react"

export default function Reactions() {
    /* ----- STATES & HOOKS ----- */
    const { socket } = useSocket()
    const { username, meetingCode } = useGlobals()
    const containerRef = useRef<HTMLDivElement>(null)
    const [showReactions, setShowReactions] = useState<boolean>(false)
    const [refHeight, setRefHeight] = useState<number>(0)
    /* ------ EVENT HANDLER ----- */
    useEffect(() => {
        if (containerRef.current) {
            setRefHeight(containerRef.current.getBoundingClientRect().height)
        }
    }, [containerRef])
    /* -------- RENDERING ------- */
    return <div //* CONTAINER
        ref={containerRef}
        className={classMerge(
            "flex justify-center items-end", //? Display
        )}
    >
        {showReactions && <div
            className={classMerge(
                "p-[8px] rounded-full", //? Sizing
                "bg-[rgb(64,64,64)]", //? Background
                "absolute flex gap-[8px] justify-center items-center", //? Display
            )}
            style={{
                translate: `0 -${refHeight + (16 + 8)}px`
            }}
        >
            {['🩷', '🎉', '👋', '👍', '👎', '😂', '😢', '🤬'].map((emoji, index) => {
                const message: string = emoji //? Required for specific parameter in server
                return <Button //* EMOJI ICON
                    key={index}
                    circle textSize={"small"}
                    onClick={() => {
                        socket.emit("send-message", { username, meetingCode, message }) //? Send the reaction message
                        setShowReactions(false) //? Close the reaction tab
                    }}
                    className={classMerge(
                        "bg-[#525252]", //? Background
                        "hover:bg-[#646464]", //? Hover
                        "aspect-square p-[8px]", //? Sizing
                        "text-[20px]", //? Emoji Size
                    )}
                >{emoji}</Button>
            })}
        </div>}
        <Button //* REACTION
            circle useIcon iconSrc="/[Icon] Reactions 2.png" iconOverlay
            onClick={() => {
                setShowReactions(!showReactions)
            }}
            className={classMerge(
                "bg-[#525252]", //? Background
                "hover:bg-[#646464]", //? Hover
            )}
        />
    </div>
}