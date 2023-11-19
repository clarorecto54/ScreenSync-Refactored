export interface ParticipantsProps {
    name: string
    socketID: string
    IPv4: string
}
export interface RoomInfo {
    hostname: string
    hostID: string
    hostIPv4: string
    meetingCode: string
    meetingKey: string
    participants: ParticipantsProps[]
    chatLog: MessageProps[]
    streamStatus: { isStreaming: boolean, streamerID: string }
}
export interface MessageProps {
    sender: string
    senderID: string
    time: string
    message: string | string[]
}