import { classMerge } from "@/components/utils"
import Button from "@/components/atom/button"
import { useSession } from "@/components/hooks/useSession"
import { useSocket } from "@/components/hooks/useSocket"
import { useGlobals } from "@/components/hooks/useGlobals"
/* ----- MAIN FUNCTIONS ----- */
export default function Dock() {
    /* ----- STATES & HOOKS ----- */
    const { username, meetingCode } = useGlobals()
    const { socket } = useSocket()
    const {
        setClientLeaved,
        isHost, stream,
        streamAccess, setStreamAccess,
        isStreaming, setIsStreaming,
        muteStream, setMuteStream,
        setStream,
    } = useSession()
    /* -------- RENDERING ------- */
    return <div //* APP DOCK
        className="flex gap-[16px] justify-center items-center">
        {(isStreaming || streamAccess) && <Button //* ANNOTATION
            circle useIcon iconSrc="/[Icon] Annotations.png" iconOverlay
            className={classMerge(
                "bg-[#525252]", //? Background
                "hover:bg-[#646464]", //? Hover
            )} />}
        <Button //* REACTIONS
            circle useIcon iconSrc="/[Icon] Reactions 2.png" iconOverlay
            className={classMerge(
                "bg-[#525252]", //? Background
                "hover:bg-[#646464]", //? Hover
            )} />
        {!isHost && <Button //* RAISE HAND
            circle useIcon iconSrc="/[Icon] Raise Hand.png" iconOverlay
            className={classMerge(
                "bg-[#525252]", //? Background
                "hover:bg-[#646464]", //? Hover
            )} />}
        {(isStreaming && stream.getAudioTracks().length > 0) && <Button //* MUTE
            circle useIcon iconOverlay
            iconSrc={muteStream ? "/[Icon] Audio (1).png" : "/[Icon] Audio (2).png"}
            customOverlay={muteStream ? "redOverlay" : undefined}
            onClick={() => setMuteStream(!muteStream)}
            className={classMerge(
                "bg-[#525252]", //? Background
                "hover:bg-[#646464]", //? Hover
            )} />}
        <Button //* SHARE SCREEN
            circle useIcon iconOverlay // TODO DISABLE THIS BUTTON WHEN HOST IS STREAMING
            iconSrc={isStreaming ? "/[Icon] Share Screen (1).png" : "/[Icon] Share Screen (2).png"}
            customOverlay={(isStreaming || (!isHost && !streamAccess)) ? "redOverlay" : undefined}
            onClick={async () => {
                if (isHost || streamAccess) {
                    if (!isStreaming && navigator.mediaDevices.getDisplayMedia) { //? Start Streaming
                        await navigator.mediaDevices.getDisplayMedia({
                            audio: true,
                            video: { displaySurface: "browser" },
                        }).then(mediaStream => { setIsStreaming(true); setStream(mediaStream) })
                    } else { //? Stop Streaming
                        setStream(new MediaStream())
                        setIsStreaming(false)
                        setStreamAccess(false)
                    }
                } else {
                    socket?.emit("get-stream-access", username, meetingCode)
                }
            }}
            className={classMerge(
                "bg-[#525252]", //? Background
                "hover:bg-[#646464]", //? Hover
            )} />
        <Button //* END CALL
            onClick={() => setClientLeaved(true)}
            circle useIcon iconSrc="/[Icon] End Call.png" iconOverlay
            containerClass="w-[calc(32px*3)]" />
    </div>
}