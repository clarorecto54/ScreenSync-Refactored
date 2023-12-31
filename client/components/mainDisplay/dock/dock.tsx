import { classMerge } from "@/components/utils"
import Button from "@/components/atom/button"
import { useSession } from "@/components/hooks/useSession"
import { useSocket } from "@/components/hooks/useSocket"
import { useGlobals } from "@/components/hooks/useGlobals"
import { transformSDP } from "@/components/utils.sdp"
import Reactions from "./reactions/reaction"
import AnnotationTrigger from "./annotation/trigger"
/* ----- MAIN FUNCTIONS ----- */
export default function Dock() {
    /* ----- STATES & HOOKS ----- */
    const { username, meetingCode } = useGlobals()
    const { socket, socketID, peer } = useSocket()
    const {
        setClientLeaved,
        isHost, stream, isViewer, participantList, setFullscreen,
        isAnnotating, setIsAnnotating,
        peerCall, setPeerCall,
        streamAccess, setStreamAccess,
        isStreaming, setIsStreaming,
        muteStream, setMuteStream,
        setStream,
    } = useSession()
    /* -------- RENDERING ------- */
    return <div //* APP DOCK
        className="flex gap-[16px] justify-center items-center">
        <Reactions />
        {((!isViewer && isStreaming && (streamAccess || isHost))) && //* ANNOTATION
            <AnnotationTrigger />}
        {(isStreaming && stream && isViewer) && <Button //* FULL SCREEN
            circle useIcon iconSrc="/images/Fullscreen.svg" iconOverlay
            customOverlay={isAnnotating ? "blueOverlay" : ""}
            onClick={() => setFullscreen(true)}
            className={classMerge(
                "bg-[#525252]", //? Background
                "hover:bg-[#646464]", //? Hover
            )} />}
        {(isStreaming && stream && stream.getAudioTracks().length > 0) && <Button //* MUTE
            circle useIcon iconOverlay
            iconSrc={muteStream ? "/images/Audio (1).svg" : "/images/Audio (2).svg"}
            customOverlay={muteStream ? "redOverlay" : undefined}
            onClick={() => setMuteStream(!muteStream)}
            className={classMerge(
                "bg-[#525252]", //? Background
                "hover:bg-[#646464]", //? Hover
            )} />}
        {(!isViewer || isHost) && <Button //* SHARE SCREEN
            circle useIcon iconOverlay
            iconSrc={isStreaming ? "/images/Share Screen (1).svg" : "/images/Share Screen (2).svg"}
            customOverlay={(isStreaming || (!isHost && !streamAccess)) ? "redOverlay" : undefined}
            onClick={async () => {
                if (isHost || streamAccess) {
                    if (!isStreaming && peer && navigator.mediaDevices.getDisplayMedia) { //? Start Streaming
                        const originalStream = await navigator.mediaDevices.getDisplayMedia({
                            audio: true,
                            video: true,
                        })
                        //* TRACK MODIFICATION
                        for (const track of originalStream.getTracks()) {
                            track.applyConstraints({
                                displaySurface: "window",
                                frameRate: { exact: 60 },
                                channelCount: 2,
                                noiseSuppression: true,
                                echoCancellation: true,
                                sampleRate: { min: 44100, max: 192000, ideal: 88200 },
                                sampleSize: { min: 16, max: 24, ideal: 24 }
                            }).then(() => { return })
                        }
                        //* VIDEO MODIFICATION
                        for (const video of originalStream.getVideoTracks()) {
                            await video.applyConstraints({
                                displaySurface: "window",
                                frameRate: { exact: 60 },
                                channelCount: 2,
                                noiseSuppression: true,
                                echoCancellation: true,
                                sampleRate: { min: 44100, max: 192000, ideal: 88200 },
                                sampleSize: { min: 16, max: 24, ideal: 24 }
                            }).then(() => { return })
                        }
                        //* AUDIO MODIFICATION
                        for (const audio of originalStream.getAudioTracks()) {
                            audio.applyConstraints({
                                displaySurface: "window",
                                frameRate: { exact: 60 },
                                channelCount: 2,
                                noiseSuppression: true,
                                echoCancellation: true,
                                sampleRate: { min: 44100, max: 192000, ideal: 88200 },
                                sampleSize: { min: 16, max: 24, ideal: 24 }
                            }).then(() => { return })
                        }
                        participantList.forEach(participant => { //? Send stream to all participants
                            if (participant.socketID !== socketID) {
                                setPeerCall(prevCall => [...prevCall, peer.call(participant.socketID, originalStream
                                    , { sdpTransform: transformSDP })])
                            }
                        })
                        socket.emit("change-stream-status", meetingCode, true) //? Update steraming status in server
                        setIsStreaming(true) //? Start streaming
                        setStream(() => { //? Set the stream scope to the page
                            originalStream.getTracks().forEach(track => { //? Streamer "stop sharing" modal behavior
                                track.addEventListener("ended", () => { //? End streaming onClick of "stop sharing" modal
                                    socket.emit("change-stream-status", meetingCode, false)
                                    setIsStreaming(false)
                                    setStream(undefined)
                                    setStreamAccess(false)
                                })
                            })
                            setMuteStream(true)
                            return originalStream
                        })
                    } else { //? Stop Streaming
                        if (peerCall.length > 0) {
                            peerCall.forEach(call => call.close())
                        }
                        stream?.getTracks().forEach(track => track.stop()) //? Removes the "stop sharing" modal
                        setIsAnnotating(false)
                        setStream(undefined)
                        setIsStreaming(false)
                        setStreamAccess(false)
                        socket.emit("change-stream-status", meetingCode, false)
                    }
                } else { //? Ask for stream access from the host
                    socket.emit("get-stream-access", username, meetingCode)
                }
            }}
            className={classMerge(
                "bg-[#525252]", //? Background
                "hover:bg-[#646464]", //? Hover
            )} />}
        <Button //* END CALL
            onClick={() => setClientLeaved(true)}
            circle useIcon iconSrc="/images/End Call.svg" iconOverlay
            containerClass="w-[calc(32px*3)]" />
    </div>
}