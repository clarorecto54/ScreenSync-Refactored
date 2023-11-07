"use client"
import { useSession } from "@/components/hooks/useSession";
import { classMerge } from "@/components/utils";
import { ReactNode } from "react";

export default function PanelPopup({ children }: { children: ReactNode }) {
    /* ----- STATES & HOOKS ----- */
    const { activePopup } = useSession()
    /* -------- RENDERING ------- */
    if (activePopup.includes("System")) {
        return <div //* VIEWPORT
            className="absolute h-full w-full flex justify-center items-center backdrop-blur-sm backdrop-brightness-50">
            <div //* CONTAINER
                className={classMerge(
                    "p-[16px] px-[24px] rounded-[24px]", //? Sizing
                    "bg-white", //? Background,
                    "flex justify-center items-center", //? Display
                )}>
                {children}
            </div>
        </div>
    } else { return <></> }
}