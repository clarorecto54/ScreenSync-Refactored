import Button from "@/components/atom/button";
import { classMerge } from "@/components/utils";
import { ParticipantsProps } from "@/types/lobby.types";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import InfoControlsPopup from "./popup";
import { useSocket } from "@/components/hooks/useSocket";

export default function InfoControlsTrigger({
    data,
    activePopup,
    setActivePopup
}: {
    data: ParticipantsProps,
    activePopup: string,
    setActivePopup: Dispatch<SetStateAction<string>>
}) {
    /* ----- STATES & HOOKS ----- */
    const { socketID } = useSocket()
    const triggerRef = useRef<HTMLDivElement>(null)
    const [refHeight, setRefHeight] = useState<number>(0)
    /* ------- REF HANDLER ------ */
    useEffect(() => {
        if (triggerRef.current) {
            setRefHeight(triggerRef.current.getBoundingClientRect().height)
        }
    }, [triggerRef])
    /* -------- RENDERING ------- */
    return <div //* CONTAINER
        className={classMerge(
            "w-full pr-[8px]", //? Sizing
            "flex justify-between items-center group", //? Display
        )}>
        <label //* PARTICIPANT NAME
            className="w-full break-words text-[16px]">
            {socketID === data.socketID ? `${data.name} (You)` : data.name}
        </label>
        <div //* TRIGGER CONTAINER
            className="flex justify-center items-end">
            <div //* TRIGGER REF
                ref={triggerRef}>
                <Button //* TRIGGER
                    circle textSize={"small"}
                    useIcon iconSrc="/[Icon] 3 Dots.png"
                    onClick={() => {
                        if (activePopup === data.socketID) {
                            setActivePopup("")
                        } else {
                            setActivePopup(data.socketID)
                        }
                    }}
                    className={classMerge(
                        "bg-transparent opacity-0 hover:bg-[#64646432] group group-hover:opacity-100", //? Background
                    )} />
            </div>
            {activePopup === data.socketID && <div //* POPUP
                className="absolute"
                style={{
                    translate: `0 -${(refHeight * 0.5) + (16 + 8)}px`
                }}>
                <InfoControlsPopup socketID={data.socketID} />
            </div>}
        </div>
    </div>
}