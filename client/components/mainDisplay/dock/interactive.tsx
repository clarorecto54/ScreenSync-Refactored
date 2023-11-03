import Button from "@/components/atom/button";
import { classMerge } from "@/components/utils";
import ParticipantsTrigger from "./interactive/participants/trigger";
import ChatsTrigger from "./interactive/chats/trigger";
import { useState } from "react";
/* ---- INTERACTIVE DOCK ---- */
export default function Interactive() {
    /* -------- RENDERING ------- */
    return <div //* INTERACTIVE ACTIONS
        className="flex gap-[16px] justify-center items-center">
        <ChatsTrigger />
        <ParticipantsTrigger />
        <Button //* ATTENDANCE
            circle useIcon iconSrc="/[Icon[ Attendance.png" iconOverlay
            className={classMerge(
                "bg-[#525252]", //? Background
                "hover:bg-[#646464]", //? Hover
            )} />
    </div>
}