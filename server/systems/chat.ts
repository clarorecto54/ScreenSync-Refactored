import { Socket } from "socket.io";
import { RoomList, TimeLog, io } from "../server";
import { RoomInfo } from "../typings/room.typings";
import * as fs from "fs"
/* ------ SUB FUNCTION ------ */
function SendUpdatedChatLog(meetingCode: string, room: RoomInfo) {
    io.to(meetingCode).emit("updated-chatLog", room.chatLog) //? Send to the participants the updated chat log
}
function BroadCastNewMessage(socket: Socket, meetingCode: string) {
    socket.broadcast.to(meetingCode).emit("new-message")
}

/* ------ MAIN FUNCTION ----- */
export default function ChatSystem(socket: Socket) {
    //* GET ROOM CHAT LOG
    socket.on("get-chatLog", (meetingCode: string) => {
        RoomList.forEach(room => {
            if (room.meetingCode === meetingCode) { //? Find the specific room
                SendUpdatedChatLog(meetingCode, room)
                return
            }
        })
    })
    //* SEND MESSAGE
    socket.on("send-message", ({ username, meetingCode, message }) => {
        RoomList.forEach(room => {
            if (room.meetingCode === meetingCode) { //? Find the specific room
                if (room.chatLog.length > 0) { //? If there are chat history
                    const lastSender = room.chatLog[room.chatLog.length - 1]
                    if (lastSender.senderID === socket.id && lastSender.time === TimeLog()) { //? If the last chat history is the same as the sender
                        if (typeof lastSender.message === "string") { //? If the last sender has 1 messag only
                            lastSender.message = [lastSender.message, message] //? Turn the message into an array of message by the same sender and time
                        } else { //? If the last sender has multiple message
                            lastSender.message.push(message) //? Add the new message into the array
                        }
                    } else { //? If the sender and time is not the same as the last in the history
                        room.chatLog.push({
                            sender: username,
                            senderID: socket.id,
                            time: TimeLog(),
                            message: message
                        })
                    }
                } else {
                    room.chatLog.push({ //? Adds new message if there's no chat history
                        sender: username,
                        senderID: socket.id,
                        time: TimeLog(),
                        message: message
                    })
                }
            }
        })
        RoomList.forEach(room => {
            if (room.meetingCode === meetingCode) { //? Find the specific room
                SendUpdatedChatLog(meetingCode, room)
                BroadCastNewMessage(socket, meetingCode)
                return
            }
        })
        try { //* GENERATING LOGS
            const prevData = fs.readFileSync(`../log/${meetingCode}/message.txt`, "utf-8") //? Read message log
            fs.writeFileSync(`../log/${meetingCode}/message.txt`, prevData.concat(`[ ${TimeLog(true)} ][ ${username} ] ${message}\n`), { encoding: "utf-8" })
        } catch { console.log(`[ ${TimeLog(true)} ][ SEVER ERROR ][ LOG ] Can't update message log file of ${meetingCode}`) }
    })
}