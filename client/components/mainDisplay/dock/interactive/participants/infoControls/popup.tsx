import Button from "@/components/atom/button";
import { useSession } from "@/components/hooks/useSession";
import { classMerge } from "@/components/utils";

export default function InfoControlsPopup({ socketID }: { socketID: string }) {
    /* ----- STATES & HOOKS ----- */
    const { mutedList, setMutedList } = useSession()
    /* -------- RENDERING ------- */
    return <div //* CONTAINER
        className={classMerge(
            "p-[8px] rounded-[8px]", //? Sizing
            "bg-white shadow", //? Background
            "flex flex-col gap-[4px]", //? Display
        )}>
        <Button
            textSize={("small")}
            useIcon
            onClick={() => {
                if (mutedList.includes(socketID)) { //? Check if the user is muted
                    setMutedList(mutedList.filter(id => id !== socketID)) //? Unmute
                } else {
                    setMutedList([...mutedList, socketID]) //? Mute
                }
            }}
            className={classMerge(
                "justify-start", //? Display
                "bg-[#c9c9c9] hover:bg-[#c9c9c9] hover:scale-90", //? Background
                "text-black font-[600]", //? Font
                "transition-all duration-200", //? Animation
            )} >{mutedList.includes(socketID) ? "Unmute" : "Mute"}</Button>
        <Button
            textSize={("small")}
            useIcon
            className={classMerge(
                "justify-start", //? Display
                "bg-[#e9ec7b] hover:bg-[#e9ec7b] hover:scale-90", //? Background
                "text-black font-[600]", //? Font
                "transition-all duration-200", //? Animation
            )} >Alert</Button>
        <Button
            textSize={("small")}
            useIcon
            className={classMerge(
                "justify-start", //? Display
                "bg-[#f36a6a] hover:bg-[#f36a6a] hover:scale-90", //? Background
                "text-black font-[600]", //? Font
                "transition-all duration-200", //? Animation
            )} >Kick</Button>
    </div>
}