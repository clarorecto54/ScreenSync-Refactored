import { classMerge } from "../../utils";
import Logo from "./logo";
import Description from "./descriptions";
import FormMenu from "./formMenu";
export default function FormPanel() {
    /* -------- RENDERING ------- */
    return <div //* CONTAINER
        className={classMerge(
            "h-full w-full", //? Sizing
            "flex flex-col gap-[32px] items-center", //? Display
            "text-black font-[400] font-[Montserrat]", //? Font
            "transition-all duration-500", //? Animation
        )}>
        <Logo />
        <Description />
        <FormMenu />
    </div>
}