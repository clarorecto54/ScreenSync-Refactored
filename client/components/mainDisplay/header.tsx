"use client"
import { useEffect, useState } from "react";
import { classMerge } from "../utils";
import { useSocket } from "../hooks/useSocket";
/* ----- MEETING HEADER ----- */
export default function Header() {
    /* ----- STATES & HOOKS ----- */
    const { socket } = useSocket()
    const [serverTime, setServerTime] = useState<string>("")
    useEffect(() => {
        socket.on("get-server-time", (time: string) => setServerTime(time))
    }, [socket])
    /* -------- RENDERING ------- */
    return <div //* CONTAINER
        className={classMerge(
            "w-full", //? Sizing
            "flex justify-between items-center", //? Display
            "Unselectable", //? Custom Class
        )}>
        <label //* TIME
            className="font-[400]">
            {serverTime}
        </label>
        <label //* APP TITLE
            className="font-[600]">
            ScreenSync
        </label>
        <label //* VERSION
            className="font-[400]">
            {require("@/package.json").version}
        </label>
    </div>
}