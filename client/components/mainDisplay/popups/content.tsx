"use client"
import Button from "@/components/atom/button";
import { useSession } from "@/components/hooks/useSession";
import { classMerge } from "@/components/utils";
import Image from "next/image";
export default function ContentPopup() {
    /* ----- STATES & HOOKS ----- */
    const { activePopup, setActivePopup, setClientLeaved } = useSession()
    /* -------- RENDERING ------- */
    if (["Alert", "Kick"].some(word => activePopup.includes(word))) {
        return <div //* CONTAINER
            className={classMerge(
                "flex justify-center items-center Unselectable", //? Display
                "text-black text-center font-[Montserrat] font-[500]", //? Font
            )}>
            {activePopup.includes("Alert") && <audio //* ALERT SOUND
                autoPlay loop>
                <source src="/sounds/alarm.wav" type="audio/wav" />
            </audio>}
            <div //* IMAGE CONTAINER
                className="h-[64px] aspect-square relative">
                <Image //* IMAGE
                    className="redOverlay"
                    src={activePopup.includes("Alert") ? "/[Icon] Alert.png" : "/[Icon] Close.png"}
                    alt=""
                    fill />
            </div>
            <div //* MAIN CONTAINER
                className="flex flex-col gap-[8px] justify-center items-center px-[32px]">
                <label //* INFORMATION
                    className="">
                    {activePopup.includes("Alert") ? "Are you still there?" : "You have been kicked by the host"}
                </label>
                <Button //* CTA BUTTON
                    textSize={"small"}
                    onClick={() => {
                        setActivePopup("")
                        if (activePopup.includes("Kick")) {
                            setClientLeaved(true)
                        }
                    }}
                    containerClass="w-max"
                    className="bg-green-500 hover:bg-green-700 hover:scale-90 transition-all duration-300">
                    {activePopup.includes("Alert") ? "Yes I'm still here" : "Back to Home"}
                </Button>
            </div>
        </div>
    } else { return <></> }
}