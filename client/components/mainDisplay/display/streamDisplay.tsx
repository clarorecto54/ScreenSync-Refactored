import { useGlobals } from "@/components/hooks/useGlobals"
import { useSession } from "@/components/hooks/useSession"
import { useSocket } from "@/components/hooks/useSocket"
import { classMerge } from "@/components/utils"
import { useEffect, useRef, useState } from "react"
export default function StreamDisplay() {
    /* ----- STATES & HOOKS ----- */
    const { socket } = useSocket()
    const { meetingCode } = useGlobals()
    const {
        isStreaming, stream, muteStream, streamAccess, isHost, canvasRef,
        annotationRatio, setAnnotationRatio,
        fullscreen, setFullscreen
    } = useSession()
    const streamRef = useRef<HTMLVideoElement>(null)
    const [orientation, setOrientation] = useState<"landscape" | "portrait">("landscape")
    /* ------ EVENT HANDLER ----- */
    useEffect(() => {
        if (canvasRef?.current) {
            const targetRef = canvasRef.current
            console.log(targetRef.height)
        }
    }, [canvasRef])
    useEffect(() => {
        const targetRef = streamRef.current
        if (isStreaming) { //? Streaming
            if (targetRef && stream) {
                window.addEventListener("resize", () => {
                    ((window.innerWidth / window.innerHeight) > 1) ? setOrientation("landscape") : setOrientation("portrait")
                })
                targetRef.srcObject = stream
                if ((isHost && !streamAccess) || streamAccess) {
                    socket.emit("stream-ratio", meetingCode, stream.getVideoTracks()[0].getSettings().aspectRatio)
                    setAnnotationRatio(stream.getVideoTracks()[0].getSettings().aspectRatio || 0)
                }
            }
        } else { //? Not Streaming
            if (targetRef) {
                window.removeEventListener("resize", () => {
                    ((window.innerWidth / window.innerHeight) > 1) ? setOrientation("landscape") : setOrientation("portrait")
                })
                targetRef.srcObject = null
            }
        }
        if (fullscreen) {
            if (targetRef) {
                targetRef.requestFullscreen({ navigationUI: "hide" }).then(() => { setFullscreen(false) })
            }
        }
    }, [socket, meetingCode, isStreaming, stream, streamRef, fullscreen, setFullscreen, isHost, setAnnotationRatio, streamAccess])
    /* -------- RENDERING ------- */
    return <div
        className={classMerge(
            "h-full w-full", //? Sizing
            "absolute flex justify-center items-center", //? Display
        )}>
        {stream && <canvas
            ref={canvasRef}
            height={1920}
            width={1920}
            style={{
                height: orientation === "landscape" ? "100%" : "auto",
                width: orientation === "portrait" ? "100%" : "auto",
                aspectRatio: annotationRatio
            }}
            className={classMerge(
                "absolute", //? Display
            )} />}
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