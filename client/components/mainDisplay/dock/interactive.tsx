import ParticipantsTrigger from "./interactive/participants/trigger";
import ChatsTrigger from "./interactive/chats/trigger";
import { useSession } from "@/components/hooks/useSession";
import Button from "@/components/atom/button";
import { classMerge } from "@/components/utils";
/* ---- INTERACTIVE DOCK ---- */
export default function Interactive() {
    /* ----- STATES & HOOKS ----- */
    const { isHost } = useSession()
    /* -------- RENDERING ------- */
    return <div //* INTERACTIVE ACTIONS
        className="flex gap-[16px] justify-center items-center">
        <ChatsTrigger />
        <ParticipantsTrigger />
        {isHost && <Button //* ATTENDANCE
            circle useIcon iconSrc="/images/Attendance 1.svg" iconOverlay
            className={classMerge(
                "bg-[#525252]", //? Background
                "hover:bg-[#646464]", //? Hover
            )} />}
    </div>
}