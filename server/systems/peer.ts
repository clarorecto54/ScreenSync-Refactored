import { Socket } from "socket.io";
import { RoomList } from "../server";

export default function PeerSystem(socket: Socket) {
    socket.on("change-stream-status", (meetingCode: string, isStreaming: boolean) => {
        RoomList.forEach(room => {
            if (room.meetingCode === meetingCode) { //? Find specific room
                room.streamStatus.isStreaming = isStreaming
                if (isStreaming) { //? If someone is streaming
                    room.streamStatus.streamerID = socket.id //? Set streamer ID
                    socket.broadcast.to(meetingCode).emit("view-status", isStreaming)
                } else { //? If no one is streaming
                    room.streamStatus.streamerID = "" //? Clear streamer ID
                    socket.broadcast.to(meetingCode).emit("view-status", isStreaming)
                }
            }
            return
        })
    })
}