/* -------- LIBRARIES ------- */
import { createServer } from "http"
import { Server } from "socket.io"
import { writeFileSync } from "fs"
import { RoomSystem } from "./systems/room"
import { RoomInfo } from "./typings/room.typings"
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

/* ------ API HANDLING ------ */
io.on("connection", (socket) => {
    //* CLIENT DISCONNECTION
    socket.on("disconnect", () => {
        NoEmptyRoom() //? Clears up empty rooms on every disconnection
        MainLog()
    })
    //* CLIENT CONNECTION
    NoEmptyRoom() //? Clears up empty rooms on every connection
    console.log(typeof io.of("/").sockets)
    MainLog()
    /* -------- MAIN API -------- */
    //* TEST
    socket.on("test", () => { console.log("Test Success") })
    //* ROOM SYSTEM
    RoomSystem(socket)
    //* SEND UPDATED ROOMLIST
    socket.on("get-room-list", () => io.local.emit("updated-room-list", RoomList))
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
const config: ServerProps = { //* PROPS
    IP: os.networkInterfaces()[Object.keys(os.networkInterfaces())[0]][0].address,
    PORT: 3001
}
try {
    const props: ServerProps = require("../client/server.json") //? Checks if the server config is existing on the client
    if (!props.PORT || !props.IP) { throw Error } //? If the server config is not valid it will throw and error
} catch (error) {
    writeFileSync("../client/server.json", JSON.stringify(config, null, 2), "utf-8") //? Export the server config to JSON
}
httpServer.listen(
    config.PORT, config.IP,
    () => {
        console.clear() //? Clear the log
        console.log(`[ ${TimeLog(true)} ][ SERVER RUNNING ] http://${config.IP}:${config.PORT}`)
    }
)