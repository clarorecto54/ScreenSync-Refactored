"use client"
import { useSession } from "@/components/hooks/useSession";
import { classMerge } from "@/components/utils";
import DefaultDisplay from "./defaultDisplay";
import StreamDisplay from "./streamDisplay";
export default function MainDisplay() {
    /* ----- STATES & HOOKS ----- */
    const {
        isStreaming
    } = useSession()
    /* -------- RENDERING ------- */
    return <div //* CONTAINER
        className={classMerge(
            "h-full w-full", //? Sizing
            "rounded-3xl overflow-hidden", //? Border
            "flex relative", //? Display
        )}>
        <DefaultDisplay />
        {isStreaming && <StreamDisplay />}
    </div>
}