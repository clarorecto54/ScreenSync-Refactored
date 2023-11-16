import { useSession } from "@/components/hooks/useSession"
import { classMerge } from "@/components/utils"
import { useEffect, useRef } from "react"
export default function StreamDisplay() {
    /* ----- STATES & HOOKS ----- */
    const {
        isStreaming, stream
    } = useSession()
    const streamRef = useRef<HTMLVideoElement>(null)
    /* ------ EVENT HANDLER ----- */
    useEffect(() => {
        if (isStreaming) { //? Streaming
            if (streamRef.current) {
                streamRef.current.srcObject = stream
            }
        } else { //? Not Streaming
            if (streamRef.current) {
                streamRef.current.srcObject = null
            }
        }
    }, [isStreaming, stream, streamRef])
    /* -------- RENDERING ------- */
    return <div
        className={classMerge(
            "h-full w-full", //? Sizing
            "absolute", //? Display
        )}>
        <video
            ref={streamRef}
            className="h-full w-full rounded-[32px] overflow-hidden"
            autoPlay
            style={{
                aspectRatio: stream.getVideoTracks()[0].getSettings().aspectRatio
            }} />
    </div>
}