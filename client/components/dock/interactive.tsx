import Button from "../atom/button";
import { classMerge } from "../utils";
/* ---- INTERACTIVE DOCK ---- */
export default function Interactive() {
    /* -------- RENDERING ------- */
    return <div //* INTERACTIVE ACTIONS
        className="flex gap-[16px] justify-center items-center">
        <Button //* CHAT
            circle useIcon iconSrc="/[Icon] Chat.png" iconOverlay
            className={classMerge(
                "bg-[#525252]", //? Background
                "hover:bg-[#646464]", //? Hover
            )} />
        <Button //* PARTICIPANTS
            circle useIcon iconSrc="/[Icons] Participants.png" iconOverlay
            className={classMerge(
                "bg-[#525252]", //? Background
                "hover:bg-[#646464]", //? Hover
            )}>99</Button>
        <Button //* ATTENDANCE
            circle useIcon iconSrc="/[Icon[ Attendance.png" iconOverlay
            className={classMerge(
                "bg-[#525252]", //? Background
                "hover:bg-[#646464]", //? Hover
            )} />
    </div>
}