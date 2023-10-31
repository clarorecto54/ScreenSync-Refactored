import { Server, Socket } from "socket.io";
import { RoomInfo } from "../typings/room.typings";
/* ------ API HANDLING ------ */
export default function RoomSystem(
    io: Server,
    socket: Socket,
    RoomList: RoomInfo[]
) {
    //* CREATE A MEETING
    socket.on("create-meeting", (newRoom: RoomInfo) => {
        RoomList.push(newRoom) //? Adds the new room
        io.local.emit("updated-room-list", RoomList) //? Sends the updated room list into the lobby
    })
}