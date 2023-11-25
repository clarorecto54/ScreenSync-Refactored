import { Socket } from "socket.io"
import { TimeLog, io } from "../server"
import * as fs from "fs"
export default function InteractiveSystem(socket: Socket) {
    //* ALERT PARTICIPANT
    socket.on("alert-participant", (name: string, meetingCode: string, targetID: string) => {
        io.to(targetID).emit("alert-participant")
        try {
            const prevData = fs.readFileSync(`../log/${meetingCode}/alert.txt`, { encoding: "utf-8" }) //? Read data of alert log
            fs.writeFileSync(`../log/${meetingCode}/alert.txt`, prevData.concat(`[ ${TimeLog(true)} ][ ${targetID} ] ${name} has been alerted\n`))
        } catch { console.log(`[ ${TimeLog(true)} ][ SEVER ERROR ][ LOG ] Can't update alert log file of ${meetingCode}`) }
    })
    //* KICK PARTICIPANT FROM THE ROOM
    socket.on("kick-participant", (name: string, meetingCode: string, targetID: string) => {
        io.to(targetID).emit("kick-participant")
        try {
            const prevData = fs.readFileSync(`../log/${meetingCode}/kick.txt`, { encoding: "utf-8" }) //? Read data of kick log
            fs.writeFileSync(`../log/${meetingCode}/kick.txt`, prevData.concat(`[ ${TimeLog(true)} ][ ${targetID} ] ${name} has been kicked\n`))
        } catch { console.log(`[ ${TimeLog(true)} ][ SEVER ERROR ][ LOG ] Can't update kick log file of ${meetingCode}`) }
    })
}