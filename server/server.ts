/* -------- LIBRARIES ------- */
import { createServer } from "https"
import { Server } from "socket.io"
import { readFileSync, writeFileSync } from "fs"
import { RoomSystem } from "./systems/room"
import { RoomInfo } from "./typings/room.typings"
import { PeerServer } from "peer"
import ChatSystem from "./systems/chat"
import InteractiveSystem from "./systems/interactive"
import PeerSystem from "./systems/peer"
import * as fs from "fs"
const os = require("os")
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
/* ------- SERVER INIT ------ */
const httpsServer = createServer({
    cert: readFileSync("./SSL/server.crt", "utf-8"),
    key: readFileSync("./SSL/server.key", "utf-8")
}, require("express")())
export const io = new Server(httpsServer, { cors: { origin: "*" } });
export const peer = PeerServer({
    proxied: true,
    ssl: {
        cert: readFileSync("./SSL/server.crt", "utf-8"),
        key: readFileSync("./SSL/server.key", "utf-8")
    },
    allow_discovery: true,
    port: config.PORT + 1,
    path: "/"
})

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
export function ServerLog(
    server: "socket" | "peer",
    message: string
) {
    console.log(`[ ${TimeLog(true)} ][ ${server.toUpperCase()} LOG ] ${message}`)
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
//* SOCKET HANDLING
io.on("connection", (socket) => {
    //* CLIENT CONNECTION
    setInterval(() => {
        io.local.emit("get-server-time", TimeLog())
    }, 1000)
    ClearInactiveSockets()
    NoEmptyRoom() //? Clears up empty rooms on every connection
    ServerLog("socket", `Client Connected: ${socket.id}`)
    ServerLog("socket", `Total Client: ${io.sockets.sockets.size}`)
    ServerLog("socket", `Total Room: ${RoomList.length}`)
    //* CLIENT DISCONNECTION
    socket.on("disconnect", () => {
        ClearInactiveSockets()
        NoEmptyRoom() //? Clears up empty rooms on every disconnection
        ServerLog("socket", `Client Disnnected: ${socket.id}`)
        ServerLog("socket", `Total Client: ${io.sockets.sockets.size}`)
        ServerLog("socket", `Total Room: ${RoomList.length}`)
    })
    /* -------- MAIN API -------- */
    //* PEER SYSTEM
    PeerSystem(socket)
    //* TEST
    socket.on("test", () => { console.log("Test Success") })
    //* ROOM SYSTEM
    RoomSystem(socket)
    //* INTERACTIVE SYSTEM
    InteractiveSystem(socket)
    //* CHAT SYSTEM
    ChatSystem(socket)
    //* GET STREAM ACCESS
    socket.on("get-stream-access", (username: string, meetingCode: string) => {
        RoomList.forEach(room => {
            if (room.meetingCode === meetingCode) {
                io.to(room.hostID).emit("get-stream-access", socket.id, username)
            }
        })
    })
    socket.on("grant-stream-access", (id: string) => {
        io.to(id).emit("grant-stream-access")
    })
    //* GET CLIENT IP
    socket.on("req-address", () => {
        io.to(socket.id).emit("my-address", socket.handshake.address.toString())
    })
});
//* PEER HANDLING
var totalPeers: number = 0
peer.on("connection", (client) => {
    totalPeers += 1
    ServerLog("peer", `Client Connected: ${client.getId()}`)
    ServerLog("peer", `Total Client: ${totalPeers}`)
})
peer.on("disconnect", (client) => {
    totalPeers -= 1
    ServerLog("peer", `Client Disconnected: ${client.getId()}`)
    ServerLog("peer", `Total Client: ${totalPeers}`)
})
/* - EXPRESS INITIALIZATION - */
httpsServer.listen(
    config.PORT,
    () => {
        if (!fs.existsSync("../log/")) {
            fs.mkdirSync("../log/")
        }
        console.clear() //? Clear the log
        console.log(`[ ${TimeLog(true)} ][ SOCKET RUNNING ] https://${config.IP}:${config.PORT}`)
        console.log(`[ ${TimeLog(true)} ][ PEER RUNNING ] https://${config.IP}:${config.PORT + 1}`)
    }
)