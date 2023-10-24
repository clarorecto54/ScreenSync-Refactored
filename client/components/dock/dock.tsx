import { classMerge } from "../utils"
import Button from "../atom/button"
/* ----- MAIN FUNCTIONS ----- */
export default function Dock() {
    /* -------- RENDERING ------- */
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