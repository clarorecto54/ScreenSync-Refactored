/* -------- LIBRARIES ------- */
import { createServer } from "http"
import { Server } from "socket.io"
import { writeFileSync } from "fs"
import { RoomSystem } from "./systems/room"
import { RoomInfo } from "./typings/room.typings"
import ChatSystem from "./systems/chat"
import InteractiveSystem from "./systems/interactive"
const os = require("os")

/* ------- SERVER INIT ------ */
const httpServer = createServer(require("express")())
export const io = new Server(httpServer, { cors: { origin: "*" } });

/* ---- GET TIME FUNCTION --- */
export function TimeLog(seconds?: boolean) { return new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: seconds ? "2-digit" : undefined }) }

/* ------- SERVER DATA ------ */
export var RoomList: RoomInfo[] = []

/* ---- SERVER FUNCTIONS ---- */
export function NoEmptyRoom() {
    RoomList = RoomList.filter((room) => { //? Replace it with new array of roomlist without empty rooms
        return room.participants.length !== 0 //? Add the rooms with active participants into the new array
    })
}
export function MainLog() {
    //? LOGS
    console.log(`[ ${TimeLog(true)} ][ SERVER ] Total Clients: ${io.sockets.sockets.size}`) //? Total clients
    console.log(`[ ${TimeLog(true)} ][ SERVER ] Total Rooms: ${RoomList.length}`)
}
function ClearInactiveSockets() {
    var activeSockets: string[] = []
    io.sockets.sockets.forEach(sockets => { //? Get the list of active sockets
        activeSockets.push(sockets.id)
    })
    RoomList.forEach(room => {
        room.participants = room.participants.filter(participants => { //? Filter out the inactive sockets
            return activeSockets.includes(participants.socketID)
        })
    })
}
/* ------ API HANDLING ------ */
io.on("connection", (socket) => {
    //* CLIENT DISCONNECTION
    socket.on("disconnect", () => {
        ClearInactiveSockets()
        NoEmptyRoom() //? Clears up empty rooms on every disconnection
        MainLog()
    })
    //* CLIENT CONNECTION
    ClearInactiveSockets()
    NoEmptyRoom() //? Clears up empty rooms on every connection
    MainLog()
    /* -------- MAIN API -------- */
    //* TEST
    socket.on("test", () => { console.log("Test Success") })
    //* ROOM SYSTEM
    RoomSystem(socket)
    //* INTERACTIVE SYSTEM
    InteractiveSystem(socket)
    //* CHAT SYSTEM
    ChatSystem(socket)
    //* GET CLIENT IP
    socket.on("req-address", () => {
        io.to(socket.id).emit("my-address", socket.handshake.address.toString())
    })
});

/* -------- PORT & IP ------- */
interface ServerProps { //* INTERFACE
    IP: string
    PORT: number
}
function GETIP() {
    var IP = "localhost" //? Default IP
    try {
        for (var index = 0; index < 4; index++) { //? Find a valid IP
            const data: string = os.networkInterfaces()[Object.keys(os.networkInterfaces())[index]][0].address
            if ((data.split(".").length - 1) === 3) {
                IP = data //? If valid IP found it will return it
                break
            }
        }
    } catch (error) { console.log("No LAN Detected running on localhost") }
    return IP
}
const config: ServerProps = { //* PROPS
    IP: GETIP(),
    PORT: 3001
}
try {
    const props: ServerProps = require("../client//server.json") //? Checks if the server config is existing on the client
    if ((!props.PORT || !props.IP) || ((props.PORT !== config.PORT) || (props.IP !== config.IP))) { throw Error } //? If the server config is not valid it will throw and error
} catch (error) {
    writeFileSync("../client//server.json", JSON.stringify(config, null, 2), "utf-8") //? Export the server config to JSON
}
httpServer.listen(
    3001,
    () => {
        console.clear() //? Clear the log
        console.log(`[ ${TimeLog(true)} ][ SERVER RUNNING ] http://${config.IP}:${config.PORT}`)
    }
)