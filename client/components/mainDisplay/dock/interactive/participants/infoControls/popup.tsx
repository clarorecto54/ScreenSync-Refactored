import Button from "@/components/atom/button";
import { useGlobals } from "@/components/hooks/useGlobals";
import { useSession } from "@/components/hooks/useSession";
import { useSocket } from "@/components/hooks/useSocket";
import { classMerge } from "@/components/utils";
import { useEffect, useState } from "react"
export default function InfoControlsPopup({ name, socketID }: { name: string, socketID: string }) {
    /* ----- STATES & HOOKS ----- */
    const socket = useSocket()
    const { meetingCode } = useGlobals()
    const { isHost, participantList, mutedList, setMutedList } = useSession()
    const [muteText, setMuteText] = useState<string>("")
    /* ------ EVENT HANDLER ----- */
    useEffect(() => {
        if (socket.socketID === socketID) { //? (You)
            if (mutedList.length === 0) { //? No one is muted
                setMuteText("Mute All")
            } else { //? Someone is muted
                setMuteText("Unmute All")
            }
        } else { //? Other Clients
            if (mutedList.includes(socketID)) { //? Participant is muted
                setMuteText("Unmute")
            } else { //? Participant is not muted
                setMuteText("Mute")
            }
        }
    }, [muteText, socket, socketID, mutedList])
    /* -------- RENDERING ------- */
    return <div //* CONTAINER
        className={classMerge(
            "p-[8px] rounded-[8px]", //? Sizing
            "bg-white shadow", //? Background
            "flex flex-col gap-[4px]", //? Display
        )}>
        {participantList.length > 1 && <Button //* MUTE BUTTON
            textSize={("small")}
            useIcon iconSrc="/images/Mute.svg"
            onClick={() => {
                if (socket.socketID === socketID) { //? (You)
                    if (mutedList.length === 0) { //? No one is muted
                        const allmute = participantList.map(info => info.socketID).filter(client => { return client !== socket.socketID })
                        setMutedList(allmute)
                    } else { //? Someone is muted
                        setMutedList([])
                    }
                } else { //? Other clients
                    if (mutedList.includes(socketID)) { //? Check if the user is muted
                        setMutedList(mutedList.filter(id => id !== socketID)) //? Unmute
                    } else {
                        setMutedList([...mutedList, socketID]) //? Mute
                    }
                }
            }}
            className={classMerge(
                "justify-start", //? Display
                "bg-[#c9c9c9] hover:bg-[#c9c9c9] hover:scale-90", //? Background
                "text-black font-[600]", //? Font
                "transition-all duration-200", //? Animation
            )} >
            {muteText}
        </Button>}
        {((socket.socketID !== socketID) && isHost) && <Button //* ALERT BUTTON
            textSize={("small")}
            useIcon iconSrc="/images/Alert.svg"
            onClick={() => {
                socket.socket.emit("alert-participant", name, meetingCode, socketID)
            }}
            className={classMerge(
                "justify-start", //? Display
                "bg-[#e9ec7b] hover:bg-[#e9ec7b] hover:scale-90", //? Background
                "text-black font-[600]", //? Font
                "transition-all duration-200", //? Animation
            )} >Alert</Button>}
        {((socket.socketID !== socketID) && isHost) && <Button //* KICK BUTTON
            textSize={("small")}
            useIcon iconSrc="/images/Kick.svg"
            onClick={() => {
                socket.socket.emit("kick-participant", name, meetingCode, socketID)
            }}
            className={classMerge(
                "justify-start", //? Display
                "bg-[#f36a6a] hover:bg-[#f36a6a] hover:scale-90", //? Background
                "text-black font-[600]", //? Font
                "transition-all duration-200", //? Animation
            )} >Kick</Button>}
    </div >
}