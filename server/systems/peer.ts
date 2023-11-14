import { Socket } from "socket.io";
import { RoomList } from "../server";

export default function PeerSystem(socket: Socket) {
    //* SET PEER ID
    socket.on("set-peer-id", (meetingCode: string, socketID: string, peerID) => {
        RoomList.forEach(room => {
            if (room.meetingCode === meetingCode) { //? Find client's room
                room.participants.forEach(participant => {
                    if (participant.socketID === socketID) { //? Find specific client
                        participant.peerID = peerID //? Set client's peer ID
                    }
                })
            }
        })
    })
}