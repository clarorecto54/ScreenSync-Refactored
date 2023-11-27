"use client"
import Button from "@/components/atom/button";
import { classMerge } from "@/components/utils";
import Dock from "./dock";
import Interactive from "./interactive";
import { useGlobals } from "@/components/hooks/useGlobals";
/* ------ MAIN APP DOCK ----- */
export default function AppDock() {
    /* ----- STATES & HOOKS ----- */
    const { meetingCode } = useGlobals()
    /* -------- RENDERING ------- */
    return <div //* CONTAINER
        className={classMerge(
            "w-full p-[16px]", //? Sizing
            "flex items-center justify-evenly Unselectable", //? Display
        )}>
        <Button //* COPY MEETING
            useIcon iconSrc="/images/Copy.svg" iconOverlay
            onClick={() => navigator.clipboard.writeText(meetingCode)}
            className={classMerge(
                "bg-transparent", //? Background
                "hover:bg-[#525252]", //? Hover
                "transition-all duration-200", //? Animation
            )}>Meeting Code</Button>
        <Dock />
        <Interactive />
    </div>
}