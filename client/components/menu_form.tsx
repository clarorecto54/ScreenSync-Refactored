"use client"
import { useEffect, useState } from "react";
import Button from "./atom/button";
import Textbox from "./atom/textbox";
import { useGlobals } from "./hooks/useGlobals";
import { useSocket } from "./hooks/useSocket";
import { classMerge } from "./utils";
import Image from "next/image";

export default function MenuForm() {
    /* ----- STATES & HOOKS ----- */
    const socket = useSocket()
    const globals = useGlobals()
    const [inputs, setInputs] = useState<{ //? User inputs
        username: string,
        meetingKey: string
    }>({
        username: "",
        meetingKey: ""
    })
    /* ------ EVENT HANDLER ----- */
    useEffect(() => {
        globals.username = inputs.username
    }, [inputs])
    /* -------- RENDERING ------- */
    return <div //* CONTAINER
        className={classMerge(
            "h-full w-full", //? Sizing
            "flex flex-col gap-[32px] items-center", //? Display
            "text-black font-[400] font-[Montserrat]", //? Font
        )}>
        <div //* LOGO & APP NAME
            className="flex flex-row gap-[8px] justify-center items-center">
            <div //* LOGO CONTAINER
                className="relative h-[calc(8*7px)] aspect-square">
                <Image //* LOGO
                    src="/[Logo] TUP.png"
                    alt=""
                    fill />
            </div>
            <div //* APP NAME & SERVER STATUS
                className="flex flex-col">
                <label //* APP NAME
                    className="text-[16px] font-[600]">
                    ScreenSync
                </label>
                <div //* SERVER STATUS
                    className="flex gap-[8px] items-center">
                    <label //* LABEL
                        className="text-[12px] italic">
                        {socket.isConnected ? "Connected" : "Disconnected"}
                    </label>
                    <div //* STATUS ICON
                        className={classMerge(
                            "h-[10px] aspect-square rounded-full", //? Base Styling
                            socket.isConnected ? "bg-green-600" : "bg-red-600"
                        )} />
                </div>
            </div>
        </div>
        <div //* DESCRIPTION
            className="w-full flex flex-col gap-[8px]">
            <label //* HEADER 1
                className="font-[500] font-[Montserrat] text-[16px]">
                TUPC Screen Mirroring Solution
            </label>
            <label //* DESCRIPTION
                className="font-[400] font-[Montserrat] text-[12px]">
                Enjoy the power of visual communication and take your educational experience to the next level
            </label>
        </div>
        <form //* FORM
            className="h-full w-full px-[16px] flex flex-col gap-[16px]">
            <div //* INPUTS
                className="flex flex-col gap-[8px]">
                <Textbox //* USERNAME
                    useIcon iconSrc="/[Icons] Participants.png"
                    textSize={"small"}
                    placeholder="What is your name?"
                    onChange={(thisElement) => {
                        setInputs({ ...inputs, username: thisElement.target.value })
                    }} />
                {inputs.username.length > 3 && <Textbox //* MEETING PASSCODE
                    useIcon iconSrc="/[Icons] Key.png"
                    textSize={"small"}
                    placeholder="Session key here"
                    onChange={(thisElement) => {
                        setInputs({ ...inputs, meetingKey: thisElement.target.value })
                    }} />}
            </div>
            {inputs.username.length > 3 && <Button //* START MEETING
                useIcon iconSrc="/[Icon] Join.png" iconOverlay
                textSize={"small"}
                className="font-[600]">
                Start Meeting
            </Button>}
        </form>
    </div>
}