"use client"
import { useGlobals } from "./hooks/useGlobals";
import { useLobby } from "./hooks/useLobby";
import FormPanel from "./menuForm/formPanel";
import SessionsPanel from "./sessions/sessions";
import { classMerge } from "./utils";
/* - PANELS IN LANDING PAGE - */
export default function MenuPanel() {
    /* ----- STATES & HOOKS ----- */
    const { //* LOBBY CONTEXT HOOK
        roomList
    } = useLobby()
    const { //* GLOBAL VARIABLE CONTEXT HOOK
        username
    } = useGlobals()
    /* -------- RENDERING ------- */
    return <div //* VIEWPORT
        className={classMerge(
            "h-full w-full", //? Sizing
            "flex justify-center items-center", //? Display
        )}>
        <div //* FORM PANEL
            className={classMerge(
                "p-[32px] px-[64px]", //? Sizing
                "bg-white rounded-[32px] panelStyle", //? Background
            )}>
            <FormPanel />
        </div>
        <div //* ROOM LIST PANEL
            className={classMerge(
                "p-[32px]", //? Sizing
                "Unselectable", //? Limitations
                "absolute overflow-hidden translate-x-[calc(64px*6)]", //? Display
                "bg-white rounded-[32px] panelStyle", //? Background
                "transition-[opacity] duration-500", //? Animation
                username.length > 3 && roomList.length > 0 ? "opacity-100" : "opacity-0 pointer-events-none", //? Conditional
            )}>
            <SessionsPanel />
        </div>
    </div>
}