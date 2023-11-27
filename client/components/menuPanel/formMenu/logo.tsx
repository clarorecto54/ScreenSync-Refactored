import { useSocket } from "../../hooks/useSocket"
import Image from "next/image"
import { classMerge } from "../../utils"
export default function Logo() {
    const socket = useSocket()
    return <div //* LOGO & APP NAME
        className="flex flex-row gap-[8px] justify-center items-center">
        <div //* LOGO CONTAINER
            className="relative h-[calc(8*7px)] aspect-square">
            <Image //* LOGO
                src="/images/TUP.svg"
                alt=""
                fill
                sizes={'100vw'} />
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
                    className="text-[10px] italic Unselectable">
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