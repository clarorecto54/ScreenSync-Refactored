"use client"
import { useSocket } from "./hooks/useSocket";
import { classMerge } from "./utils";
import Image from "next/image";

export default function MenuForm() {
    const socket = useSocket()
    return <div //* CONTAINER
        className={classMerge(
            "h-full w-full", //? Sizing
            "flex flex-col gap-[16px] items-center", //? Display
            "min-h-max min-w-max", //? Breakpoints
            "text-black font-[400] font-[Montserrat]", //? Font
        )}>
        <div //* LOGO & APP NAME
            className="flex flex-row gap-[4px] border-[1px] border-red-500">
            <div //* LOGO CONTAINER
                className="relative aspect-square">
                <Image //* LOGO
                    src="/[Logo] TUP.png"
                    alt=""
                    fill />
            </div>
            <div //* APP NAME & SERVER STATUS
                className="flex flex-col">
                <label //* APP NAME
                    className="text-[14px] font-[600]">
                    ScreenSync
                </label>
                <div //* SERVER STATUS
                    className="flex gap-[4px]">

                </div>
            </div>
        </div>
    </div>
}