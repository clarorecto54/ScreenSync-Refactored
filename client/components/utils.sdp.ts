import { write, parse, SessionDescription, MediaAttributes } from "sdp-transform"
export function transformSDP(sdp: string) {
    const modifiedSDP: SessionDescription = parse(sdp)
    const quality: number = 1000000 * 100
    const fps: number = 90
    modifiedSDP.media.forEach((media, mediaIndex) => {
        //* MEDIA MODIFICATIONS
        modifiedSDP.media[mediaIndex].bandwidth = [ //? Set the bandwidth
            { type: "AS", limit: quality },
            { type: "CT", limit: quality },
            { type: "RR", limit: quality },
            { type: "RS", limit: quality },
            { type: "TIAS", limit: quality }
        ]
        modifiedSDP.media[mediaIndex].ptime = 20 //? Minimum Packeting time
        modifiedSDP.media[mediaIndex].maxptime = 30 //? Max Packeting time
        //* VIDEO & AUDIO MODIFICATIONS
        switch (media.type) {
            case "video":
                //* VIDEO FRAME RATE
                modifiedSDP.media[mediaIndex].framerate = fps //? Set the framerate
                //* CLEAR DEFAULTS
                modifiedSDP.media[mediaIndex].payloads = "" //? Clear out payloads
                modifiedSDP.media[mediaIndex].rtp = [] //? Clear out default codecs
                modifiedSDP.media[mediaIndex].fmtp = [] //? Clear out deafult configs
                modifiedSDP.media[mediaIndex].rtcpFb = [] //? Clear out acknowledgement
                //* INITAITE NEW CODECS
                const payloads: number[] = []
                const rtp: MediaAttributes["rtp"] = []
                const fmtp: MediaAttributes["fmtp"] = []
                const rtcpfbPayloads: number[] = []
                //* VP8 CODEC (96)
                payloads.push(96) //? Add VP8 Payload Code
                rtp.push({ payload: 96, codec: "VP8", rate: 90000 }) //? Codec name
                fmtp.push({ payload: 96, config: fmtpConfigs("VP8", quality, fps) }) //? Codec config
                rtcpfbPayloads.push(96) //? Add the codec payload for acknowledgement config
                //* VP8 RTX (97)
                payloads.push(97) //? Add RTX to the payload
                rtp.push({ payload: 97, codec: "rtx", rate: 90000 }) //? Codec name
                fmtp.push({ payload: 97, config: "apt=96" }) //? Retransmit to the payload of previous codec
                //* VP9 CODEC (98)
                payloads.push(98) //? Add VP8 Payload Code
                rtp.push({ payload: 98, codec: "VP9", rate: 90000 }) //? Codec name
                fmtp.push({ payload: 98, config: fmtpConfigs("VP9", quality, fps) }) //? Codec config
                rtcpfbPayloads.push(98) //? Add the codec payload for acknowledgement config
                //* VP9 RTX (99)
                payloads.push(99) //? Add RTX to the payload
                rtp.push({ payload: 99, codec: "rtx", rate: 90000 }) //? Codec name
                fmtp.push({ payload: 99, config: "apt=98" }) //? Retransmit to the payload of previous codec
                //* RED [PACKET REDUNDANCY] (100)
                payloads.push(100) //? Adds red payload into the list of payloads
                rtp.push({ payload: 100, codec: "red", rate: 90000 }) //? Adds the red in RTP
                //* ADDING RTX FOR RED (101)
                payloads.push(101) //? Adds payload of RED Retransmission into the payload list
                rtp.push({ payload: 101, codec: "rtx", rate: 90000 }) //? Adds the RED's Retransmission to the RTP
                fmtp.push({ payload: 101, config: "apt=100" }) //? Retransmission of RED
                //* PACKET ERROR CORRECTION (102)
                payloads.push(102) //? Adds payload of ULPFEC into the payload list
                rtp.push({ payload: 102, codec: "ulpfec", rate: 90000 }) //? Adds ulpfec to the RTP
                //* H264 CODEC (103)
                payloads.push(103) //? Add VP8 Payload Code
                rtp.push({ payload: 103, codec: "H264", rate: 90000 }) //? Codec name
                fmtp.push({ payload: 103, config: fmtpConfigs("H264", quality, fps) }) //? Codec config
                rtcpfbPayloads.push(103) //? Add the codec payload for acknowledgement config
                //* H264 RTX (104)
                payloads.push(104) //? Add RTX to the payload
                rtp.push({ payload: 104, codec: "rtx", rate: 90000 }) //? Codec name
                fmtp.push({ payload: 104, config: "apt=103" }) //? Retransmit to the payload of previous codec
                //* APPLYING NEW CODECS
                modifiedSDP.media[mediaIndex].payloads = payloads.join(" ")
                modifiedSDP.media[mediaIndex].rtp = rtp
                modifiedSDP.media[mediaIndex].fmtp = fmtp
                modifiedSDP.media[mediaIndex].rtcpFb = generateRTCPFB(rtcpfbPayloads)
                break
            case "audio":
                //* CLEAR DEFAULTS
                modifiedSDP.media[mediaIndex].payloads = "" //? Clear out payloads
                modifiedSDP.media[mediaIndex].rtp = [] //? Clear out default codecs
                modifiedSDP.media[mediaIndex].fmtp = [] //? Clear out deafult configs
                modifiedSDP.media[mediaIndex].rtcpFb = [] //? Clear out acknowledgement
                //* APPLYING NEW CODECS
                modifiedSDP.media[mediaIndex].payloads = "111 63"
                modifiedSDP.media[mediaIndex].rtp = [
                    { payload: 111, codec: "opus", rate: 48000, encoding: 2 },
                    { payload: 63, codec: "red", rate: 48000, encoding: 2 }]
                modifiedSDP.media[mediaIndex].fmtp = [
                    {
                        payload: 111, config: [
                            "useinbandfec=1",
                            "usedtx=1",
                            "cbr=0",
                            "stereo=1",
                            "minptime=10",
                            "ptime=15",
                            "maxptime=20",
                            `maxaveragebitrate=${quality / 1000}`,
                            "maxplaybackrate=192000",
                        ].join(";")
                    },
                    { payload: 63, config: "111/111" }
                ]
                modifiedSDP.media[mediaIndex].rtcpFb = generateRTCPFB([111])
                break
            default:
                break
        }
    })
    return write(modifiedSDP).replaceAll("262144", JSON.stringify(quality)) //? Send the modified SDP with the new max packet size
}
function fmtpConfigs(codec: "VP8" | "VP9" | "H264", quality: number, fps: number) {
    const extraConfigs = [
        "sprop-stereo=1",
        `x-google-start-bitrate=${(quality / 1000) * 0.25}`,
        `x-google-max-bitrate=${quality / 1000}`,
        "x-google-max-quantization=40",
        "x-google-min-quantization=10",
        "x-google-buffer-initial-delay=1000",
    ].join(";")
    const payloadConfigs = {
        VP8:
            [
                "profile-id=1",
                "max-fs=12288",
                "qp-min=10",
                "qp-max=40",
                `max-mbps=${quality / 1000}`,
                `max-fr=${fps}`
            ].concat(extraConfigs).join(";"),
        VP9: [
            "profile-id=1",
            "max-fs=12288", //? Macroblock
            `max-fr=${fps}`, //? FPS
        ].concat(extraConfigs).join(";"),
        H264: [
            "level-asymmetry-allowed=1",
            "packetization-mode=1",
            "profile-level-id=64001f",
            "max-fs=12288",
            `max-fr=${fps}`,
            `max-mbps=${quality / 1000}`
        ].concat(extraConfigs).join(";")
    }
    return payloadConfigs[codec]
}
function generateRTCPFB(payloads: number[]) {
    const rtcpFb: MediaAttributes["rtcpFb"] = []
    const mainType = ["nack", "rtpfb"]
    const nack = ["pli", "fir"]
    const rtpfb = ["transport-wide-cc", "ccm-fir", "ccm-nack", "ccm-tmmbr"]
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
                default:
                    break
            }
        }
    }
    return rtcpFb
}