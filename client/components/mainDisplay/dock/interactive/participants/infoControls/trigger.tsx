import Button from "@/components/atom/button";
import { classMerge } from "@/components/utils";
import { ParticipantsProps } from "@/types/lobby.types";
import { useEffect, useRef, useState } from "react";
import InfoControlsPopup from "./popup";

export default function InfoControlsTrigger({ data }: { data: ParticipantsProps }) {
    /* ----- STATES & HOOKS ----- */
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
    return <div //* CONTAINER
        className={classMerge(
            "w-full pr-[8px]", //? Sizing
            "flex justify-between items-center group", //? Display
        )}>
        <label className="w-full break-words text-[16px]">{data.name}</label>
        <div //* TRIGGER CONTAINER
            className="flex justify-center items-end">
            <div //* TRIGGER REF
                ref={triggerRef}>
                <Button //* TRIGGER
                    circle textSize={"small"}
                    useIcon iconSrc="/[Icon] 3 Dots.png"
                    onClick={() => setShowPopup(!showPopup)}
                    className={classMerge(
                        "bg-transparent opacity-0 hover:bg-[#64646432] group group-hover:opacity-100", //? Background
                    )} />
            </div>
            {showPopup && <div //* POPUP
                // TODO SET SHOWPOPUP TO FALSE ON SCROLL
                className="absolute"
                style={{
                    translate: `0 -${refHeight + (16 + 8)}px`
                }}>
                <InfoControlsPopup socketID={data.socketID} />
            </div>}
        </div>
    </div>
}