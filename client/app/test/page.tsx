"use client"
import Button from "@/components/atom/button";
import { classMerge } from "@/components/utils";
import { useState } from "react"
export default function Test() {
    const [showLabel, updateLabel] = useState<boolean>(false)
    return <div //* VIEWPORT
        className={classMerge(
            "h-[100vh] w-[100vw]", //? Sizing
            "flex justify-center items-center", //? Display
            "bg-black", //? Background
        )}>
        <div //* CONTAINER
            className={classMerge(
                "p-[32px] px-[64px]", //? Sizing
                "bg-white rounded-[32px] panelStyle", //? Background
            )}>
            <div //* CONTENTS
                className="flex flex-col gap-[16px] justify-center items-center">
                <label
                    className="text-[16px] font-[500] font-[Montserrat]">This is a test</label>
                <div
                    className={classMerge(
                        "h-0 overflow-hidden transition-[height] duration-500 min-h-max", //? Base Styling
                        showLabel ? "h-min" : "", //? Conditional Styling
                    )}>
                    <label className="text-[16px] font-[500] font-[Montserrat]">Custom Label</label>
                </div>
                <Button
                    useIcon iconOverlay
                    onClick={() => { updateLabel(!showLabel) }} />
            </div>
        </div>
    </div >
}