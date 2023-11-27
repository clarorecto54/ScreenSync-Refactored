import { useGlobals } from "@/components/hooks/useGlobals"
import { useSession } from "@/components/hooks/useSession"
import { useSocket } from "@/components/hooks/useSocket"
import { classMerge, drawLine } from "@/components/utils"
import { Point, HostLineProps, DrawLineProps } from "@/types/annotation.types"
import { useEffect, useRef, useState } from "react"
export default function StreamDisplay() {
    /* ----- STATES & HOOKS ----- */
    const { socket } = useSocket()
    const { meetingCode } = useGlobals()
    const {
        isStreaming, stream, muteStream, streamAccess, isHost,
        hostline, setHostLine,
        brushSize, brushColor,
        clearCanvas, setClearCanvas,
        isAnnotating, setIsAnnotating,
        annotationRatio, setAnnotationRatio,
        fullscreen, setFullscreen
    } = useSession()
    const streamRef = useRef<HTMLVideoElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const canvasContainerRef = useRef<HTMLDivElement>(null)
    const prevPoint = useRef<null | Point>(null)
    const [mouseDown, setMouseDown] = useState<boolean>(false)
    const [orientation, setOrientation] = useState<"landscape" | "portrait">("landscape")
    /* ------ EVENT HANDLER ----- */
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
    /* ----- CANVAS HANDLING ---- */
    useEffect(() => {
        const canvas = canvasRef.current;
        const container = canvasContainerRef.current;
        const context = canvas?.getContext("2d")
        if (hostline && canvas && context) {
            drawLine({
                color: hostline.color,
                context: context,
                currentPoint: hostline.currentPoint,
                lineWidth: hostline.lineWidth,
                prevPoint: hostline.prevPoint
            })
            setHostLine(null)
        }
        if (clearCanvas && canvas && context) {
            if (isHost || streamAccess) { socket.emit("clear-canvas", meetingCode) }
            context.clearRect(0, 0, canvas.width, canvas.height)
            setClearCanvas(false)
        }
        const handleCanvasResize = () => {
            if (canvas && container) {
                const containerRect = container.getBoundingClientRect();
                canvas.width = containerRect.width;
                canvas.height = containerRect.height;
            }
        };
        window.addEventListener("resize", handleCanvasResize);
        return () => {
            window.removeEventListener("resize", handleCanvasResize);
        };
    }, [canvasRef, canvasContainerRef, clearCanvas, setClearCanvas, hostline, setHostLine, isHost, meetingCode, socket, streamAccess]);
    /* -------- RENDERING ------- */
    return <div
        className={classMerge(
            "h-full w-full", //? Sizing
            "absolute flex justify-center items-center", //? Display
        )}>
        {stream && <div //* CANVAS CONTAINER
            ref={canvasContainerRef}
            style={{
                height: orientation === "landscape" ? "100%" : "auto",
                width: orientation === "portrait" ? "100%" : "auto",
                aspectRatio: annotationRatio
            }}
            className={classMerge(
                "absolute z-[2] flex justify-center items-center overflow-hidden", //? Display
            )}>
            <canvas
                ref={canvasRef}
                height={1920}
                width={1920}
                onMouseDown={() => setMouseDown(true)}
                onMouseUp={() => setMouseDown(false)}
                onMouseMove={(mouse) => {
                    const canvas = canvasRef?.current
                    const container = canvasContainerRef?.current
                    if (canvas && container) {
                        const rect = canvas.getBoundingClientRect()
                        const preciseX: number = mouse.clientX - rect.left
                        const preciseY: number = mouse.clientY - rect.top
                        const currentPoint: Point = { x: preciseX, y: preciseY }
                        const context = canvas.getContext("2d")
                        if (context && isAnnotating && mouseDown) {
                            const hostline: HostLineProps = {
                                currentPoint: currentPoint,
                                prevPoint: prevPoint.current,
                                lineWidth: brushSize,
                                color: brushColor
                            }
                            socket.emit("draw-line", meetingCode, hostline)
                            drawLine({
                                context: context,
                                currentPoint: currentPoint,
                                prevPoint: prevPoint.current,
                                lineWidth: brushSize,
                                color: brushColor
                            })
                        }
                        prevPoint.current = currentPoint
                    }
                }} />
        </div>}
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