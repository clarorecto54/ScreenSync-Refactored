"use client"
import { useSession } from "@/components/hooks/useSession";
import { classMerge } from "@/components/utils";
import DefaultDisplay from "./defaultDisplay";
export default function MainDisplay() {
    /* ----- STATES & HOOKS ----- */
    const { //* SESSION CONTEXT HOOK
        isStreaming
    } = useSession()
    return <div //* CONTAINER
        className={classMerge(
            "h-full w-full", //? Sizing
            "rounded-3xl overflow-hidden", //? Border
        )}>
        {!isStreaming && <DefaultDisplay />}
    </div>
}