"use client"
import Button from "@/components/atom/button";
import { useState, useEffect } from "react"
import { useSession } from "@/components/hooks/useSession";
import { classMerge } from "@/components/utils";
import Image from "next/image";
import { useSocket } from "@/components/hooks/useSocket";
export default function ContentPopup() {
    /* ----- STATES & HOOKS ----- */
    const { socket } = useSocket()
    const { streamRequest, streamAccess, activePopup, setActivePopup, setClientLeaved } = useSession()
    const [asset, setAsset] = useState<{ icon: string, message: string, CTAText: string }>({ icon: "", message: "", CTAText: "" })
    /* ------ EVENT HANDLER ----- */
    useEffect(() => {
        if (activePopup.includes("Kick")) { setAsset({ icon: "/[Icon] Kick.png", message: "You have been kicked by the host", CTAText: "Back to Home" }) }
        if (activePopup.includes("Alert")) { setAsset({ icon: "/[Icon] Alert.png", message: "Are you still there?", CTAText: "Yes I'm still here" }) }
        if (activePopup.includes("Access")) { setAsset({ icon: "/[Icon] Share Screen (2).png", message: `${streamRequest.name} is asking for an access to stream`, CTAText: "Allow" }) }
    }, [activePopup, streamRequest, setActivePopup])
    /* -------- RENDERING ------- */
    if (["Alert", "Kick", "Access"].some(word => activePopup.includes(word))) {
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
                    src={asset.icon}
                    alt=""
                    fill
                    sizes="(max-wdth: 512px) 100vw" />
            </div>
            <div //* MAIN CONTAINER
                className="flex flex-col gap-[8px] justify-center items-center px-[32px]">
                <label //* INFORMATION
                    className="max-w-[40vw] break-words">
                    {asset.message}
                </label>
                <div //* CTA CONTAINER
                    className="flex justify-center items-center gap-[16px]">
                    <Button //* CTA BUTTON
                        textSize={"small"}
                        onClick={() => {
                            setActivePopup("")
                            if (activePopup.includes("Kick")) {
                                setClientLeaved(true)
                            }
                            if (activePopup.includes("Access")) {
                                socket.emit("grant-stream-access", streamRequest.id)
                            }
                        }}
                        containerClass="w-max"
                        className="bg-green-500 hover:bg-green-700 hover:scale-90 transition-all duration-300">
                        {asset.CTAText}
                    </Button>
                    {activePopup.includes("Access") && <Button //* CANCEL BUTTON
                        textSize={"small"}
                        onClick={() => {
                            setActivePopup("")
                        }}
                        containerClass="w-max"
                        className="bg-red-500 hover:bg-red-700 hover:scale-90 transition-all duration-300">
                        Don&apos;t Allow
                    </Button>}
                </div>
            </div>
        </div>
    } else { return <></> }
}