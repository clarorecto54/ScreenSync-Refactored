"use client"
import Button from "@/components/atom/button";
import { classMerge } from "@/components/utils";
import Dock from "./dock";
import Interactive from "./interactive";
/* ------ MAIN APP DOCK ----- */
export default function AppDock() {
    /* -------- RENDERING ------- */
    return <div //* CONTAINER
        className={classMerge(
            "w-full p-[16px] px-[64px]", //? Sizing
            "flex items-center justify-between Unselectable", //? Display
        )}>
        <Button //* COPY MEETING
            useIcon iconSrc="/[Icon] Copy.png" iconOverlay
            className={classMerge(
                "bg-transparent", //? Background
                "hover:bg-[#525252]", //? Hover
                "transition-all duration-200", //? Animation
            )}>Meeting Code</Button>
        <Dock />
        <Interactive />
    </div>
}