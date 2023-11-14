export interface ParticipantsProps {
    name: string
    socketID: string
    peerID?: string
    IPv4: string
}
export interface RoomInfo {
    hostname: string
    hostID: string
    meetingCode: string
    meetingKey: string
    participants: ParticipantsProps[]
    chatLog: MessageProps[]
}
export interface MessageProps {
    sender: string
    senderID: string
    time: string
    message: string | string[]
}