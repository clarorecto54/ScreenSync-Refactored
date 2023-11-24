import { write, parse, SessionDescription, MediaAttributes } from "sdp-transform"
export function transformSDP(sdp: string) {
    const modifiedSDP: SessionDescription = parse(sdp)
    const quality: number = 1000000 * 100
    const fps: number = 60
    //* INITAITE NEW CODECS
    const payloads: number[] = []
    const rtp: MediaAttributes["rtp"] = []
    const fmtp: MediaAttributes["fmtp"] = []
    const rtcpfbPayloads: number[] = []
    //* TEMPLATES
    const GoogleFlags = [
        `x-google-start-bitrate=${(quality / 1000) * 0.25}`,
        `x-google-max-bitrate=${(quality / 1000) * 0.5}`,
        "x-google-max-quantization=40",
        "x-google-min-quantization=10",
        "x-google-buffer-initial-delay=250",
    ]
    function addCODEC(payload: number, codec: string, config: string, rate?: number) {
        //* CODEC
        payloads.push(payload) //? Add VP8 Payload Code
        rtp.push({ payload: payload, codec: codec, rate: rate ? rate : 90000 }) //? Codec name
        fmtp.push({ payload: payload, config: config }) //? Codec config
        rtcpfbPayloads.push(payload) //? Add the codec payload for acknowledgement config
        //* RTX
        payloads.push(payload + 1) //? Add RTX to the payload
        rtp.push({ payload: payload + 1, codec: "rtx", rate: rate ? rate : 90000 }) //? Codec name
        fmtp.push({ payload: payload + 1, config: `apt==${payload}` }) //? Retransmit to the payload of previous codec
    }
    function addRTPRTX(payload: number, codec: string) {
        //* RTP
        payloads.push(payload) //? Adds RTP payload into the list of payloads
        rtp.push({ payload: payload, codec: codec, rate: 90000 }) //? Adds in RTP
        //* RTX
        payloads.push(payload + 1) //? Adds payload of RTP Retransmission into the payload list
        rtp.push({ payload: payload + 1, codec: "rtx", rate: 90000 }) //? Adds the Retransmission to the RTP
        fmtp.push({ payload: payload + 1, config: `apt=${payload}` }) //? Retransmission of RTP
    }
    function addRTPOnly(payload: number, codec: string) {
        //* RTP ONLY
        payloads.push(payload) //? Adds payload of RTP into the payload list
        rtp.push({ payload: payload, codec: codec, rate: 90000 }) //? Adds to the RTP
    }
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
                modifiedSDP.media[mediaIndex].protocol.concat("/AVP")
                modifiedSDP.media[mediaIndex].framerate = fps //? Set the framerate
                //* CLEAR DEFAULTS
                modifiedSDP.media[mediaIndex].payloads = "" //? Clear out payloads
                modifiedSDP.media[mediaIndex].rtp = [] //? Clear out default codecs
                modifiedSDP.media[mediaIndex].fmtp = [] //? Clear out deafult configs
                modifiedSDP.media[mediaIndex].rtcpFb = [] //? Clear out acknowledgement
                //* RED [PACKET REDUNDANCY] (96)
                addRTPRTX(96, "red")
                //* PACKET ERROR CORRECTION (98)
                addRTPOnly(98, "ulpfec")
                //* VP8 CODEC (99)
                addCODEC(99, "VP8", [
                    "max-fs=10200",
                    `max-fr=${fps}`,
                ].join(";"))
                //* H264 CODEC (101)
                addCODEC(101, "H264", [
                    "profile-level-id=64001f",
                    "level-asymmetry-allowed=1",
                    "packetization-mode=1",
                    "max-fs=10200",
                    `max-mbps=${(quality / 1000) * 0.5}`
                ].join(";"))
                //* APPLYING NEW CODECS
                modifiedSDP.media[mediaIndex].payloads = payloads.join(" ")
                modifiedSDP.media[mediaIndex].rtp = rtp
                modifiedSDP.media[mediaIndex].fmtp = fmtp
                modifiedSDP.media[mediaIndex].rtcpFb = generateRTCPFB(rtcpfbPayloads)
                modifiedSDP.media[mediaIndex].xGoogleFlag = GoogleFlags.join(";")
                break
            case "audio":
                //* MEDIA MODIFICATIONS
                modifiedSDP.media[mediaIndex].protocol.concat("/AVP")
                //* CLEAR DEFAULTS
                modifiedSDP.media[mediaIndex].payloads = "" //? Clear out payloads
                modifiedSDP.media[mediaIndex].rtp = [] //? Clear out default codecs
                modifiedSDP.media[mediaIndex].fmtp = [] //? Clear out deafult configs
                modifiedSDP.media[mediaIndex].rtcpFb = [] //? Clear out acknowledgement
                //* APPLYING NEW CODECS
                modifiedSDP.media[mediaIndex].payloads = "111 63"
                modifiedSDP.media[mediaIndex].rtp = [
                    { payload: 63, codec: "red", rate: 48000, encoding: 2 },
                    { payload: 111, codec: "opus", rate: 48000, encoding: 2 }]
                modifiedSDP.media[mediaIndex].fmtp = [
                    { payload: 63, config: "111/111" },
                    {
                        payload: 111, config: [
                            "stereo=1",
                            "sprop-stereo=1",
                            "useinbandfec=1",
                            "usedtx=1",
                            "cbr=0",
                            "stereo=1",
                            "minptime=10",
                            "ptime=15",
                            "maxptime=20",
                            `maxaveragebitrate=${(quality / 1000) * 1}`,
                            "maxplaybackrate=192000",
                            "sprop-maxcapturerate=192000"
                        ].join(";")
                    }]
                modifiedSDP.media[mediaIndex].rtcpFb = generateRTCPFB([111])
                break
            default:
                break
        }
    })
    // return sdp //? Debug for normal SDP
    return write(modifiedSDP).replaceAll("262144", JSON.stringify(quality * 0.05)) //? Send the modified SDP with the new max packet size
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