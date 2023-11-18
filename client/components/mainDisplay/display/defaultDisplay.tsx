import { useSession } from "@/components/hooks/useSession";
import { classMerge } from "@/components/utils";
import Image from "next/image";
/* ----- DEFAULT DISPLAY ---- */
export default function DefaultDisplay() {
    /* ----- STATES & HOOKS ----- */
    const { isStreaming } = useSession()
    /* -------- RENDERING ------- */
    return <div //* CONTAINER
        className={classMerge(
            "h-full w-full", //? Sizing
            isStreaming ? "bg-[#161616]" : "bg-[#525252]", //? Conditional Background
            "flex flex-col gap-[32px] justify-center items-center Unselectable", //? Display
            "transition-[background-color] duration-500", //? Animation
        )}>
        <div //* LOGO CONTAINER
            className={classMerge(
                "relative aspect-square h-[256px]", //? Base Styling
                isStreaming ? "opacity-0" : "opacity-100", //? Conditional
                "transition-[opacity] duration-500" //? Animation
            )} >
            <Image //* LOGO
                src="/[Logo] TUP.png"
                alt=""
                fill
                sizes="(max-wdth: 1200px) 100vw" />
        </div >
        <label //* SCHOOL NAME
            className={classMerge(
                "text-center font-[500] text-[20px] font-[Montserrat] leading-[40px]", //? Base Styling
                isStreaming ? "opacity-0" : "opacity-100", //? Conditional
                "transition-[opacity] duration-500" //? Animation
            )}>
            Technological University of the Philippines <br />
            Cavite Campus
        </label>
    </div>
}