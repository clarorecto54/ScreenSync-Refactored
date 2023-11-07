import { Socket } from "socket.io"
import { io } from "../server"
export default function InteractiveSystem(socket: Socket) {
    //* ALERT PARTICIPANT
    socket.on("alert-participant", (meetingCode, targetID) => {
        io.to(targetID).emit("alert-participant")
    })
    //* KICK PARTICIPANT FROM THE ROOM
    socket.on("kick-participant", (meetingCode, targetID) => {
        io.to(targetID).emit("kick-participant")
    })
}