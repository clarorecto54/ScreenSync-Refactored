"use client"
import Textbox from "../../atom/textbox";
import { classMerge } from "../../utils";
import { useState } from "react"
import Image from "next/image";
import { useGlobals } from "../../hooks/useGlobals";
import { useSocket } from "../../hooks/useSocket";
export default function Room({ //* ARGS
    hostID,
    hostname,
    meetingCode,
    meetingKey,
    participants,
}: { //* TYPES
    hostID: string,
    hostname: string,
    meetingCode: string,
    meetingKey: string,
    participants: number,
}) {
    /* ----- STATES & HOOKS ----- */
    const {
        username, setMeetingCode
    } = useGlobals()
    const { socket } = useSocket()
    const [showInput, setShowInput] = useState<boolean>(false) //? Key input visibility
    const [key, setKey] = useState<string>("") //? Key input value
    const [isWrongKey, alertWrongKey] = useState<boolean>(false)
    /* -------- RENDERING ------- */
    return <button //* CONTAINER
        onClick={() => {
            if (meetingKey) { //? If there are meeting key set the key input will be visible
                setShowInput(!showInput)
            }
            else { //? If there are no meeting key user will join the room immediately
                setMeetingCode(meetingCode)
                socket.emit("join-room", username, meetingCode)
            }
        }}
        className={classMerge(
            "w-full px-[16px] py-[8px] rounded-[8px]", //? Sizing
            "flex flex-col", //? Display
            "hover:bg-gray-100", //? Background
            "transition-all duration-200", //? Animation
        )}>
        <label //* HOSTNAME
            className="text-[14px] font-[600] hover:cursor-pointer flex gap-[8px] justify-center items-center">{hostname}
            {meetingKey && <div //* LOCKED SESSION ICON CONTAINER
                className="relative h-[10px] aspect-square">
                <Image //* LOCKED SESSION ICON
                    src="/[Icons] Lock.png"
                    alt=""
                    fill
                    sizes="(max-wdth: 512px) 100vw" />
            </div>}</label>
        <label //* MEETING CODE
            className="text-[10px] italic hover:cursor-pointer">{meetingCode}</label>
        <label //* COUNT OF PARTICIPANTS
            className="text-[12px] italic font-[600] hover:cursor-pointer">
            {participants} people
        </label>
        {meetingKey && <form //* INPUT CONTAINER
            onSubmit={(thisElement) => {
                thisElement.preventDefault()
                if (meetingKey === key) {
                    setMeetingCode(meetingCode)
                    socket.emit("join-room", username, meetingCode)
                    alertWrongKey(false)
                }
                else { //? Turn the input border to red if the key is wrong
                    alertWrongKey(true)
                }
            }}
            className={classMerge(
                "overflow-hidden", //? Base Styling
                showInput ? "h-full" : "h-0", //? Conditional
            )}>
            {showInput && <Textbox //* PASSCODE INPUT
                autoFocus password maxLength={32}
                useIcon iconSrc="/[Icons] Key.png"
                textSize={"small"} placeholder="Put the key here"
                onChange={(thisElement) => {
                    setKey(thisElement.target.value)
                }}
                onBlur={() => { setShowInput(!showInput) }}
                containerClass={classMerge(
                    "w-full", //? Sizing
                    isWrongKey ? "focus-within:border-[1px] focus-within:border-red-600" : undefined, //? Conditional
                )}
                className="w-full" />}
        </form>
        }
    </button>
}