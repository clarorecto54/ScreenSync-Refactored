"use client"
import { useEffect, useState } from "react";
import Button from "./atom/button";
import Textbox from "./atom/textbox";
import { useGlobals } from "./hooks/useGlobals";
import { useSocket } from "./hooks/useSocket";
import { classMerge } from "./utils";
import Image from "next/image";
import { useLobby } from "./hooks/useLobby";

export default function MenuForm() {
    const { roomList } = useLobby()
    useEffect(() => {
        console.log(roomList)
    }, [roomList])
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

function Logo() {
    const socket = useSocket()
    return <div //* LOGO & APP NAME
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
                className="text-[16px] font-[600] Unselectable">
                ScreenSync
            </label>
            <div //* SERVER STATUS
                className="flex gap-[8px] items-center">
                <label //* LABEL
                    className="text-[12px] italic Unselectable">
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
}
function Description() {
    return <div //* DESCRIPTION
        className="w-full flex flex-col gap-[8px] max-w-min">
        <label //* HEADER 1
            className="font-[500] font-[Montserrat] text-[16px] min-w-max Unselectable">
            TUPC Screen Mirroring Solution
        </label>
        <label //* DESCRIPTION
            className="font-[400] font-[Montserrat] text-[12px] Unselectable">
            Enjoy the power of visual communication and take your educational experience to the next level
        </label>
    </div>
}
function FormMenu() {
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
    return <form //* FORM
        className="h-full w-full px-[16px] flex flex-col gap-[16px]"
        onSubmit={(thisElement) => { //? What happens on submit
            thisElement.preventDefault()
        }}>
        <div //* INPUTS
            className="flex flex-col gap-[8px]">
            <Textbox //* USERNAME
                useIcon iconSrc="/[Icons] Participants.png"
                textSize={"small"} maxLength={32} value={inputs.username}
                placeholder="What is your name?"
                onChange={(thisElement) => {
                    setInputs({ ...inputs, username: thisElement.target.value })
                }} />
            {inputs.username.length > 3 && <Textbox //* MEETING PASSCODE
                useIcon iconSrc="/[Icons] Key.png"
                textSize={"small"} maxLength={32} value={inputs.meetingKey}
                placeholder="Session key here"
                onChange={(thisElement) => {
                    setInputs({ ...inputs, meetingKey: thisElement.target.value })
                }} />}
        </div>
        {inputs.username.length > 3 && <Button //* START MEETING
            useIcon iconSrc="/[Icon] Join.png" iconOverlay
            textSize={"small"} type="submit"
            className="font-[600]">
            Start Meeting
        </Button>}
    </form>
}