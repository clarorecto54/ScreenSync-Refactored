import { RoomInfo } from "../typings/room.typings";
import { NoEmptyRoom, MainLog, io, RoomList, TimeLog } from "../server";
import { Socket } from "socket.io";
/* ------ API HANDLING ------ */
function RefreshRoomList() {
    NoEmptyRoom() //? Clears up empty rooms
    io.local.emit("updated-room-list", RoomList) //? Sends the updated room list into the lobby
    MainLog()
}

/* ------ MAIN FUNCTION ----- */
export function RoomSystem(socket: Socket) {
    //* CREATE A MEETING
    socket.on("create-meeting", (newRoom: RoomInfo) => {
        RoomList.push(newRoom) //? Adds the new room
        socket.join(newRoom.meetingCode) //? Host will join the newly created room
        RefreshRoomList()
        console.log(`[ ${TimeLog(true)} ][ SERVER ][ ROOM ][ ${newRoom.meetingCode} ] has been created by ${newRoom.hostname}`)
    })
    //* JOIN MEETING
    socket.on("join-room", (username: string, meetingCode: string) => {
        socket.join(meetingCode) //? Client will join the room
        RoomList.forEach((room) => { //? Add the newly joined participant in the participant list
            if (room.meetingCode === meetingCode) { //? Find the specific room
                room.participants.push({
                    IPv4: socket.handshake.address,
                    name: username,
                    socketID: socket.id
                })
            }
        })
        RefreshRoomList()
        console.log(`[ ${TimeLog(true)} ][ SERVER ][ ROOM ][ ${meetingCode} ] ${username} joined the room`)
    })
    //* LEAVE MEETING
    socket.on("leave-room", (username: string, meetingCode: string) => {
        RoomList.forEach((room) => {
            if (room.meetingCode === meetingCode) { //? Find the specific room of the participant
                room.participants = room.participants.filter((participants) => { //? Replace the participants list with the updated one
                    return participants.socketID !== socket.id //? Removes the participants info from the list
                })
            }
        })
        socket.leave(meetingCode) //? Client will leave the room
        RefreshRoomList()
        console.log(`[ ${TimeLog(true)} ][ SERVER ][ ROOM ][ ${meetingCode} ] ${username} left the room`)
    })
}