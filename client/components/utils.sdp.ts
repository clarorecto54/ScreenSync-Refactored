import { write, parse, SessionDescription, SharedDescriptionFields, MediaAttributes, MediaDescription } from "sdp-transform"
export function transformSDP(sdp: string) {
    const modifiedSDP: SessionDescription = parse(sdp)
    modifiedSDP.media.forEach((media, mediaIndex) => {
        //* MEDIA MODIFICATIONS
        modifiedSDP.media[mediaIndex].framerate = 90 //? Set the framerate
        modifiedSDP.media[mediaIndex].bandwidth = [ //? Set the bandwidth
            { type: "AS", limit: 1000000 * 100 },
            { type: "CT", limit: 1000000 * 100 },
            { type: "RR", limit: 1000000 * 100 },
            { type: "RS", limit: 1000000 * 100 },
            { type: "TIAS", limit: 1000000 * 100 }
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
                        case 98: case 100:  //? VP9 Modification
                            modifiedSDP.media[mediaIndex].fmtp[fmtpIndex].config = myVideoConfig()
                            break
                        case 39: case 102: case 104: case 106: case 108: case 112: case 127: //? H264 Modification
                            // const splitted = modifiedSDP.media[mediaIndex].fmtp[fmtpIndex].config.split(";") //? Split it for more accurate modification
                            // splitted[1] = "packetization-mode=1" //? Set the packetization mode to 1
                            // splitted.push("sprop-stereo=1") //? Add a stereo config
                            // modifiedSDP.media[mediaIndex].fmtp[fmtpIndex].config = splitted.join(';')
                            modifiedSDP.media[mediaIndex].fmtp[fmtpIndex].config = "apt=100;" + myVideoConfig() //? Retransmit H264 -> VP9
                            break
                        case 97: case 103: case 105: case 107: case 109: case 125: case 40: case 46: case 99: case 101: case 113: case 117: //? Retransmission
                            modifiedSDP.media[mediaIndex].fmtp[fmtpIndex].config = "apt=100;" + myVideoConfig() //? Retransmit all packets to VP9
                            break
                    }
                })
                modifiedSDP.media[mediaIndex].fmtp.unshift({ //? Adding VP8 payload for specific configuration
                    payload: 96,
                    config: myVideoConfig()
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
    return write(modifiedSDP).replaceAll("262144", JSON.stringify(1000000 * 2)) //? Send the modified SDP with the new max packet size
}
function myVideoConfig() {
    return [
        "profile-id=2",
        "sprop-stereo=1",
        "profile-level-id=42e01f",
        "level-asymmetry-allowed=1",
        "packetization-mode=1",
        "max-fr=90",
        "x-google-start-bitrate=0",
        "x-google-max-bitrate=100000",
        "x-google-min-quantization=32",
        "x-google-buffer-initial-delay=1",
    ].join(';')
}
function generateRTCPFB(payloads: number[]) {
    const rtcpFb: {
        payload: number;
        type: string;
        subtype?: string | undefined;
    }[] = []
    const mainType = ["nack", "tmmbr", "rtpfb", "xr"]
    const nack = ["pli", "fir"]
    const rtpfb = ["transport-wide-cc", "ccm-fir", "ccm-nack", "ccm-tmmbr"]
    const xr = ["voip-metrics", "receiver-reference-time", "dlrr"]
    for (const payload of payloads) { //? Push payload
        for (const main of mainType) {
            rtcpFb.push({ //? Push the main type
                payload: payload,
                type: main
            })
            switch (main) { //? Push the sub types
                case "nack":
                    for (const sub of nack) {
                        rtcpFb.push({
                            payload: payload,
                            type: main,
                            subtype: sub
                        })
                    }
                    break
                case "rtpfb":
                    for (const sub of rtpfb) {
                        rtcpFb.push({
                            payload: payload,
                            type: main,
                            subtype: sub
                        })
                    }
                    break
                case "xr":
                    for (const sub of xr) {
                        rtcpFb.push({
                            payload: payload,
                            type: main,
                            subtype: sub
                        })
                    }
                    break
                default:
                    break
            }
        }
    }
    return rtcpFb
}