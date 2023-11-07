import Textbox from "@/components/atom/textbox"
import { classMerge } from "@/components/utils"
import { useRef, useState } from "react"
import { useSocket } from "@/components/hooks/useSocket"
import { useGlobals } from "@/components/hooks/useGlobals"
import Message from "./message"
import { useSession } from "@/components/hooks/useSession"

export default function ChatsPopup() {
    /* ----- STATES & HOOKS ----- */
    const { socket } = useSocket()
    const { chatLog, mutedList } = useSession()
    const { username, meetingCode } = useGlobals()
    const inputRef = useRef<HTMLInputElement>(null)
    const [message, setMessage] = useState<string>("")
    /* -------- RENDERING ------- */
    return <div //* CONTAINER
        className={classMerge(
            "h-[48vh] w-[16vw] rounded-[16px] p-[16px] px-[32px]", //? Sizing
            "min-h-[400px] max-h-[calc(400px*1.25)] min-w-[300px] max-w-[calc(300px*1.25)]", //? Limits
            "bg-white shadow", //? Background
            "flex flex-col gap-[16px]", //? Display
            "text-black text-[20px] font-[Montserrat] font-[500]", //? Font
        )}>
        Chat History
        <div //* MESSAGE LIST
            className={classMerge(
                "h-full w-full overflow-hidden overflow-y-scroll scroll-smooth", //? Sizing
                "flex flex-col-reverse gap-[16px]", //? Display
            )}>
            {chatLog.slice().reverse().map((message, index) => {
                if (!mutedList.includes(message.senderID)) { //? Filters out muted senders
                    return <Message
                        key={index}
                        data={message} />
                }
            })}
        </div>
        <form //* INPUT CONTAINER
            onSubmit={(thisElement) => {
                thisElement.preventDefault() //? Prevent refreshing the page on submit
                if (message) {
                    socket?.emit("send-message", { username, meetingCode, message })
                    setMessage("")
                    if (inputRef.current) {
                        inputRef.current.focus() //? Textbox will stay on focus after sending a message
                    }
                }
            }}>
            <Textbox //* MESSAGE INPUT
                value={message} ref={inputRef}
                useSubmit SubmitSrc="/[Icon] Send.png"
                placeholder="Type your message here"
                textSize={"small"} maxLength={255}
                containerClass="shadow"
                onChange={(thisElement) => setMessage(thisElement.target.value)} />
        </form>
    </div>
}