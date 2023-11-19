import { RoomInfo } from "../typings/room.typings";
import { NoEmptyRoom, ServerLog, io, RoomList, TimeLog } from "../server";
import { Socket } from "socket.io";
/* ------ API HANDLING ------ */
function RefreshRoomList() {
    NoEmptyRoom() //? Clears up empty rooms
    io.local.emit("updated-room-list", RoomList) //? Sends the updated room list into the lobby
    ServerLog("socket", `Total Client: ${io.sockets.sockets.size}`)
    ServerLog("socket", `Total Room: ${RoomList.length}`)
}
/* ------ SUB FUNCTION ------ */
function SendParticipantList() {
    RoomList.forEach(room => {
        io.to(room.meetingCode).emit("updated-participant-list", room.participants)
    })
}
/* ------ MAIN FUNCTION ----- */
export function RoomSystem(socket: Socket) {
    //* SEND UPDATED ROOMLIST
    socket.on("get-room-list", () => io.local.emit("updated-room-list", RoomList))
    //* SEND UPDATED PARTICIPANT LIST
    socket.on("get-participant-list", () => SendParticipantList())
    //* GET HOST
    socket.on("check-host", (name: string, meetingCode: string) => {
        RoomList.forEach(room => {
            if (meetingCode === room.meetingCode) { //? Find the specific room
                if ((name === room.hostname) && (socket.handshake.address === room.hostIPv4)) { //? If ip and name is the same with the host info
                    room.hostID = socket.id //? Change the socketID to the latest (when the host got disconnected)
                    io.to(socket.id).emit("host-authority") //? Grand host access
                }
            }
        })
    })
    //* CREATE A MEETING
    socket.on("create-meeting", (newRoom: RoomInfo) => {
        RoomList.push(newRoom) //? Adds the new room
        socket.join(newRoom.meetingCode) //? Host will join the newly created room
        RefreshRoomList()
        SendParticipantList()
        console.log(`[ ${TimeLog(true)} ][ SOCKET ][ ROOM ][ ${newRoom.meetingCode} ] has been created by ${newRoom.hostname}`)
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
                if (room.streamStatus.isStreaming) { //? If someone is streaming
                    console.log("Late comer spotted")
                    setTimeout(() => {
                        io.to(room.streamStatus.streamerID).emit("late-comer", socket.id)
                    }, 500);
                }
                return
            }
        })
        RefreshRoomList()
        SendParticipantList()
        console.log(`[ ${TimeLog(true)} ][ SOCKET ][ ROOM ][ ${meetingCode} ] ${username} joined the room`)
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
        SendParticipantList()
        console.log(`[ ${TimeLog(true)} ][ SOCKET ][ ROOM ][ ${meetingCode} ] ${username} left the room`)
    })
}