import test from "node:test"
import { write, parse, SessionDescription, SharedDescriptionFields, MediaAttributes, MediaDescription } from "sdp-transform"
export function transformSDP(sdp: string) {
    const modifiedSDP: SessionDescription = parse(sdp)
    modifiedSDP.media.forEach((media, mediaIndex) => {
        //* MEDIA MODIFICATIONS
        modifiedSDP.media[mediaIndex].framerate = 60 //? Set the framerate
        modifiedSDP.media[mediaIndex].bandwidth = [ //? Set the bandwidth
            { type: "AS", limit: 90000000 },
            { type: "CT", limit: 90000000 },
            { type: "RR", limit: 90000000 },
            { type: "RS", limit: 90000000 },
            { type: "TIAS", limit: 90000000 }
        ]
        modifiedSDP.media[mediaIndex].ptime = 20
        modifiedSDP.media[mediaIndex].maxptime = 30 //? Max Packeting time
        //* VIDEO & AUDIO MODIFICATIONS
        switch (media.type) {
            case "video":
                //* RTP MODIFICATIONS
                modifiedSDP.media[mediaIndex].rtp.forEach((rtp, rtpIndex) => {
                    switch (rtp.payload) {
                        case 39: case 102: case 104: case 106: case 108: case 112: case 127: //? H264 Retransmission
                            modifiedSDP.media[mediaIndex].rtp[rtpIndex].codec = "rtx"
                            break
                    }
                })
                //* FMTP MODIFICATIONS
                modifiedSDP.media[mediaIndex].fmtp.forEach((fmtp, fmtpIndex) => {
                    switch (fmtp.payload) {
                        case 98:  //? VP9 Modification
                            modifiedSDP.media[mediaIndex].fmtp[fmtpIndex].config = "profile-id=1;sprop-stereo=1"
                            break
                        case 100:
                            modifiedSDP.media[mediaIndex].fmtp[fmtpIndex].config = "profile-id=2;sprop-stereo=1"
                            break
                        case 39: case 102: case 104: case 106: case 108: case 112: case 127: //? H264 Modification
                            // const splitted = modifiedSDP.media[mediaIndex].fmtp[fmtpIndex].config.split(";") //? Split it for more accurate modification
                            // splitted[1] = "packetization-mode=1" //? Set the packetization mode to 1
                            // splitted.push("sprop-stereo=1") //? Add a stereo config
                            // modifiedSDP.media[mediaIndex].fmtp[fmtpIndex].config = splitted.join(';')
                            modifiedSDP.media[mediaIndex].fmtp[fmtpIndex].config = "apt=100"
                            break
                        case 97: case 103: case 105: case 107: case 109: case 125: case 40: case 46: case 99: case 101: case 113: case 117: //? Retransmission
                            modifiedSDP.media[mediaIndex].fmtp[fmtpIndex].config = "apt=100"
                            break
                    }
                })
                modifiedSDP.media[mediaIndex].fmtp.unshift({ //? Adding VP8 payload for specific configuration
                    payload: 96,
                    config: "max-fr=60;max-fs=0;max-br=10000;stereo=1"
                })
                modifiedSDP.media[mediaIndex].fmtp.push({ //? Add a error correction
                    payload: 118,
                    config: "fec-type=2"
                })
                break
            case "audio":
                break
            default:
                break
        }
    })
    return write(modifiedSDP).replaceAll("262144", "2000000") //? Send the modified SDP with the new max packet size
}