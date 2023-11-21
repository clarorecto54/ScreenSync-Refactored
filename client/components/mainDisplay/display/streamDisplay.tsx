import { useSession } from "@/components/hooks/useSession"
import { classMerge } from "@/components/utils"
import { useEffect, useRef } from "react"
export default function StreamDisplay() {
    /* ----- STATES & HOOKS ----- */
    const {
        isStreaming, stream, muteStream,
        fullscreen, setFullscreen
    } = useSession()
    const streamRef = useRef<HTMLVideoElement>(null)
    /* ------ EVENT HANDLER ----- */
    useEffect(() => {
        if (isStreaming) { //? Streaming
            if (streamRef.current && stream) {
                streamRef.current.srcObject = stream
            }
        } else { //? Not Streaming
            if (streamRef.current) {
                streamRef.current.srcObject = null
            }
        }
        if (fullscreen) {
            if (streamRef.current) {
                streamRef.current.requestFullscreen({ navigationUI: "hide" }).then(() => { setFullscreen(false) })
            }
        }
    }, [isStreaming, stream, streamRef, fullscreen, setFullscreen])
    /* -------- RENDERING ------- */
    return <div
        className={classMerge(
            "h-full w-full", //? Sizing
            "absolute", //? Display
        )}>
        {stream && <video
            ref={streamRef}
            muted={muteStream}
            className="h-full w-full rounded-[32px] overflow-hidden"
            autoPlay
            style={{
                colorAdjust: "exact",
                colorInterpolation: "sRGB",
                colorRendering: "optimizeQuality",
                textRendering: "optimizeLegibility",
                shapeRendering: "geometricPrecision",
                aspectRatio: stream.getVideoTracks()[0].getSettings().aspectRatio
            }} />}
    </div>
}