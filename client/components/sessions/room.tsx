"use client"
import Textbox from "../atom/textbox";
import { classMerge } from "../utils";
import { useState, useRef } from "react"
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
    const [showInput, setShowInput] = useState<boolean>(false) //? Key input visibility
    const [key, setKey] = useState<string>("") //? Key input value
    const [isWrongKey, alertWrongKey] = useState<boolean>(false)
    const inputRef = useRef<HTMLInputElement>(null)
    /* -------- RENDERING ------- */
    return <button //* CONTAINER
        onClick={() => {
            if (meetingKey) { //? If there are meeting key set the key input will be visible
                setShowInput(!showInput)
            }
            else { //? If there are no meeting key user will join the room immediately
                console.log("You have entered the room")
            }
        }}
        className={classMerge(
            "w-full px-[16px] py-[8px] rounded-[8px]", //? Sizing
            "flex flex-col", //? Display
            "hover:bg-gray-100", //? Background
            "transition-all duration-200", //? Animation
        )}>
        <label //* HOSTNAME
            className="text-[14px] font-[600] hover:cursor-pointer">{hostname}</label>
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
                    // TODO EVENT AFTER THE PASSWORD IS CORRECT
                    alertWrongKey(false)
                    console.log("passcode is correct")
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
                ref={inputRef} autoFocus
                useIcon iconSrc="/[Icons] Key.png"
                textSize={"small"} placeholder="Put the key here"
                maxLength={32}
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