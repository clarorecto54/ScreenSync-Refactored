import Button from "./atom/button";
import { classMerge } from "./utils";
export default function AppDock() {
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
function Dock() {
    return <div //* APP DOCK
        className="flex gap-[16px] justify-center items-center">
        <Button //* ANNOTATION
            circle useIcon iconSrc="/[Icon] Annotations.png" iconOverlay
            className={classMerge(
                "bg-[#525252]", //? Background
                "hover:bg-[#646464]", //? Hover
            )} />
        <Button //* REACTIONS
            circle useIcon iconSrc="/[Icon] Reactions 2.png" iconOverlay
            className={classMerge(
                "bg-[#525252]", //? Background
                "hover:bg-[#646464]", //? Hover
            )} />
        <Button //* RAISE HAND
            circle useIcon iconSrc="/[Icon] Raise Hand.png" iconOverlay
            className={classMerge(
                "bg-[#525252]", //? Background
                "hover:bg-[#646464]", //? Hover
            )} />
        <Button //* MUTE
            circle useIcon iconSrc="/[Icon] Audio (2).png" iconOverlay
            className={classMerge(
                "bg-[#525252]", //? Background
                "hover:bg-[#646464]", //? Hover
            )} />
        <Button //* SHARE SCREEN
            circle useIcon iconSrc="/[Icon] Tabs.png" iconOverlay
            className={classMerge(
                "bg-[#525252]", //? Background
                "hover:bg-[#646464]", //? Hover
            )} />
        <Button //* END CALL
            circle useIcon iconSrc="/[Icon] End Call.png" iconOverlay
            containerClass="w-[calc(32px*3)]" />
    </div>
}
function Interactive() {
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