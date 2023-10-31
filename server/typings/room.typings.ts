export interface ParticipantsProps {
    name: string
    socketID: string
    IPv4: string
}
export interface RoomInfo {
    hostname: string
    hostID: string
    meetingCode: string
    meetingKey: string
    participants: ParticipantsProps[]
}