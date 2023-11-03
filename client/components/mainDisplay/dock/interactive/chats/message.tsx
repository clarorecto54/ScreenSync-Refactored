import { useSocket } from "@/components/hooks/useSocket";
import { classMerge } from "@/components/utils";
import { MessageProps } from "@/types/session.types";

export default function Message({ data }: { data: MessageProps }) {
    /* ----- STATES & HOOKS ----- */
    const { socketID } = useSocket()
    /* -------- RENDERING ------- */
    return <div //* CONTAINER
        className={classMerge(
            "w-full pr-[8px]", //? Sizing
            "flex flex-col gap-[4px]", //? Display
        )}>
        <div //* USERNAME & TIME
            className={classMerge(
                "w-full flex gap-[8px] items-center", //? Base Styling
                data.senderID === socketID ? "flex-row-reverse" : "justify-start"
            )}>
            <label className=" text-[14px] font-[600]">{
                data.senderID === socketID ? "You" : data.sender
            }</label>
            <label className=" text-[10px] font-[400]">{data.time}</label>
        </div>
        <div //* MESSAGES
            className="flex flex-col gap-[8px]">
            {typeof data.message === "string" && <label //* SINGLE MESSAGE
                className={classMerge(
                    "text-[14px]", //? Base Styling
                    data.senderID === socketID ? "text-end" : "text-start", //? Conditional
                )}>
                {data.message}
            </label>}
            {typeof data.message === "object" && data.message.map((message, index) => {
                return <label //* MULTIPLE MESSAGE
                    key={index}
                    className={classMerge(
                        "text-[14px]", //? Base Styling
                        data.senderID === socketID ? "text-end" : "text-start", //? Conditional
                    )}>
                    {message}
                </label>
            })}
        </div>
    </div>
}