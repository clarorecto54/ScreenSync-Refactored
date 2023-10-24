import { classMerge } from "./utils";
/* ----- MEETING HEADER ----- */
export default function Header() {
    /* -------- RENDERING ------- */
    return <div //* CONTAINER
        className={classMerge(
            "w-full", //? Sizing
            "flex justify-between items-center", //? Display
            "Unselectable", //? Custom Class
        )}>
        <label //* TIME
            className="font-[400]">
            00:00 XX
        </label>
        <label //* APP TITLE
            className="font-[600]">
            ScreenSync
        </label>
        <label //* VERSION
            className="font-[400]">
            {require("@/package.json").version}
        </label>
    </div>
}