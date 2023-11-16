import { classMerge } from "@/components/utils"
import Button from "@/components/atom/button"
import { useSession } from "@/components/hooks/useSession"
/* ----- MAIN FUNCTIONS ----- */
export default function Dock() {
    /* ----- STATES & HOOKS ----- */
    const {
        setClientLeaved,
        isStreaming, setIsStreaming,
        stream, setStream,
    } = useSession()
    /* -------- RENDERING ------- */
    return <div //* APP DOCK
        className="flex gap-[16px] justify-center items-center">
        <Button //* ANNOTATION
            circle useIcon iconSrc="/[Icon] Annotations.png" iconOverlay
            className={classMerge(
                "bg-[#525252]", //? Background
                "hover:bg-[#646464]", //? Hover
            )} />
        <Button //* REACTIONS
            circle useIcon iconSrc="/[Icon] Reactions 2.png" iconOverlay
            className={classMerge(
                "bg-[#525252]", //? Background
                "hover:bg-[#646464]", //? Hover
            )} />
        <Button //* RAISE HAND
            circle useIcon iconSrc="/[Icon] Raise Hand.png" iconOverlay
            className={classMerge(
                "bg-[#525252]", //? Background
                "hover:bg-[#646464]", //? Hover
            )} />
        <Button //* MUTE
            circle useIcon iconSrc="/[Icon] Audio (2).png" iconOverlay
            className={classMerge(
                "bg-[#525252]", //? Background
                "hover:bg-[#646464]", //? Hover
            )} />
        <Button //* SHARE SCREEN
            circle useIcon iconSrc="/[Icon] Tabs.png" iconOverlay
            onClick={async () => {
                if (!isStreaming && navigator.mediaDevices.getDisplayMedia) { //? Start Streaming
                    console.log("Start Streaming")
                    setStream(await navigator.mediaDevices.getDisplayMedia({
                        audio: true,
                        video: {
                            displaySurface: "browser"
                        }
                    }))
                    setIsStreaming(true)
                } else { //? Stop Streaming
                    stream.getVideoTracks().forEach(track => track.stop())
                    setStream(new MediaStream)
                    setIsStreaming(false)
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