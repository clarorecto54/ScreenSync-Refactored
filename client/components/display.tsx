import { classMerge } from "./utils";
import Image from "next/image";
export default function MainDisplay() {
    return <div //* CONTAINER
        className={classMerge(
            "h-full w-full", //? Sizing
            "rounded-3xl overflow-hidden", //? Border
        )}>
        <DefaultDisplay />
    </div>
}
function DefaultDisplay() {
    return <div //* CONTAINER
        className={classMerge(
            "h-full w-full", //? Sizing
            "bg-[#525252]", //? Background
            "flex flex-col gap-[32px] justify-center items-center", //? Display
        )}>
        <div //* LOGO CONTAINER
            className="relative aspect-square h-[256px]">
            <Image //* LOGO
                src="/[Logo] TUP.png"
                alt=""
                fill />
        </div>
        <label //* SCHOOL NAME
            className="text-center font-[500] text-[20px] font-[Montserrat] leading-[40px]">
            Technological University of the Philippines <br />
            Cavite Campus
        </label>
    </div>
}