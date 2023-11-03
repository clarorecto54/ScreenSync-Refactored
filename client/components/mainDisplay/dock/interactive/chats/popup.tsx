import Textbox from "@/components/atom/textbox"
import { useSession } from "@/components/hooks/useSession"
import { classMerge } from "@/components/utils"
import { useRef, useState } from "react"
import Message from "./message"

export default function ChatsPopup() {
    /* ----- STATES & HOOKS ----- */
    const { chatLog } = useSession()
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
                "flex flex-col gap-[16px]", //? Display
            )}>
            {chatLog.map((message, index) => {
                return <Message
                    data={message}
                    key={index} />
            })}
        </div>
        <form //* INPUT CONTAINER
            onSubmit={(thisElement) => {
                thisElement.preventDefault() //? Prevent refreshing the page on submit
                if (message) {
                    // TODO Emit the message to the server
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