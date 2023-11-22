import { parse, write, SessionDescription, MediaAttributes } from "sdp-transform"
import { readFileSync, readJSONSync, writeFile, writeFileSync, writeJSON, writeJson } from "fs-extra"
console.clear()
//* SDP FILES
const ver1: SessionDescription = require("./sdp/ver1.json")
const ver3: SessionDescription = require("./sdp/ver3.json")
//* SDP DEPENDENCY
const codec = { payloads: false, rtp: false, fmtp: false, rtcpfb: false }
const red = { payloads: false, rtp: false, fmtp: false, rtcpfb: false }
const rtx = { payloads: false, rtp: false, fmtp: false, rtcpfb: false }
const ulpfec = { payloads: false, rtp: false, fmtp: false, rtcpfb: false }
codec.payloads = ver1.media[0].payloads.includes("102")
red.payloads = ver1.media[0].payloads.includes("116")
rtx.payloads = ver1.media[0].payloads.includes("117")
ulpfec.payloads = ver1.media[0].payloads.includes("118")
ver1.media[0].rtp.forEach(({ payload }) => {
    if (payload === 102) { codec.rtp = true }
    if (payload === 116) { red.rtp = true }
    if (payload === 117) { rtx.rtp = true }
    if (payload === 118) { ulpfec.rtp = true }
})
ver1.media[0].fmtp.forEach(({ payload }) => {
    if (payload === 102) { codec.fmtp = true }
    if (payload === 116) { red.fmtp = true }
    if (payload === 117) { rtx.fmtp = true }
    if (payload === 118) { ulpfec.fmtp = true }
})
ver1.media[0].rtcpFb.forEach(({ payload }) => {
    if (payload === 102) { codec.rtcpfb = true }
    if (payload === 116) { red.rtcpfb = true }
    if (payload === 117) { rtx.rtcpfb = true }
    if (payload === 118) { ulpfec.rtcpfb = true }
})
console.log(`
Payload: ${ver1.media[0].payloads.length}
RTP: ${ver1.media[0].rtp.length}
FMTP: ${ver1.media[0].fmtp.length}
RTCPFB: ${ver1.media[0].rtcpFb.length}
`)
console.log("Codec (102) ", codec)
console.log("RED (116) ", red)
console.log("RTX (117) ", rtx)
console.log("ULPFEC (118) ", ulpfec)
//* TEST AREA
// var prevCodec: string = "H264-RCDO"
// function checkPrevCodec() {
//     if (prevCodec === "VP9") {
//         prevCodec = "H264-RCDO"
//         return "H264-RCDO"
//     } else {
//         prevCodec = "VP9"
//         return "VP9"
//     }
// }
// const modifiedSDP: SessionDescription = parse(readFileSync("./sdp/ver1.txt", "utf-8"))
// const quality: number = 1000000 * 100
// const fps: number = 90
// modifiedSDP.media.forEach((media, mediaIndex) => {
//     //* MEDIA MODIFICATIONS
//     modifiedSDP.media[mediaIndex].framerate = 90 //? Set the framerate
//     modifiedSDP.media[mediaIndex].bandwidth = [ //? Set the bandwidth
//         { type: "AS", limit: quality },
//         { type: "CT", limit: quality },
//         { type: "RR", limit: quality },
//         { type: "RS", limit: quality },
//         { type: "TIAS", limit: quality }
//     ]
//     modifiedSDP.media[mediaIndex].ptime = 20 //? Minimum Packeting time
//     modifiedSDP.media[mediaIndex].maxptime = 30 //? Max Packeting time
//     //* VIDEO & AUDIO MODIFICATIONS
//     switch (media.type) {
//         case "video":
//             //* CLEAR DEFAULTS
//             modifiedSDP.media[mediaIndex].payloads = "" //? Clear out payloads
//             modifiedSDP.media[mediaIndex].rtp = [] //? Clear out default codecs
//             modifiedSDP.media[mediaIndex].fmtp = [] //? Clear out deafult configs
//             modifiedSDP.media[mediaIndex].rtcpFb = [] //? Clear out acknowledgement
//             //* INITAITE NEW CODECS
//             const payloads: number[] = []
//             const rtp: MediaAttributes["rtp"] = []
//             const fmtp: MediaAttributes["fmtp"] = []
//             const rtcpfbPayloads: number[] = []
//             //* BASE CODEC
//             payloads.push(96) //? Add VP8 Payload Code
//             rtp.push({ payload: 96, codec: "VP8", rate: 90000 }) //? Codec name
//             fmtp.push({ payload: 96, config: fmtpConfigs("VP8", quality, fps) }) //? Codec config
//             rtcpfbPayloads.push(96) //? Add the codec payload for acknowledgement config
//             //* ADD RTX FOR THE BASE CODEC
//             payloads.push(97) //? Add RTX to the payload
//             rtp.push({ payload: 97, codec: "rtx", rate: 90000 }) //? Codec name
//             fmtp.push({ payload: 97, config: `apt=${96}` }) //? Retransmit to the payload of previous codec
//             //* ADVANCE CODEC
//             for (let payload = 98; payload < 200; payload += 2) {
//                 //* ADD NEW CODEC
//                 const currentCodec: "VP9" | "H264-RCDO" = checkPrevCodec()
//                 payloads.push(payload) //? Add new codec to the payload
//                 rtp.push({ payload: payload, codec: currentCodec, rate: 90000 }) //? Codec name
//                 fmtp.push({ payload: payload, config: fmtpConfigs(currentCodec, quality, fps) }) //? Codec config
//                 rtcpfbPayloads.push(payload) //? Add the codec payload for acknowledgement config
//                 //* ADD RTX FOR THE PREVIOUS CODEC
//                 payloads.push(payload + 1) //? Add RTX to the payload
//                 rtp.push({ payload: payload + 1, codec: "rtx", rate: 90000 }) //? Codec name
//                 fmtp.push({ payload: payload + 1, config: `apt=${payload}` }) //? Retransmit to the payload of previous codec
//             }
//             //* PACKET REDUNDANCY
//             const REDpayload: number = payloads[payloads.length - 1] + 1
//             payloads.push(REDpayload) //? Adds red payload into the list of payloads
//             rtp.push({ payload: REDpayload, codec: "red", rate: 90000 }) //? Adds the red in RTP
//             //* ADDING RTX FOR RED
//             payloads.push(REDpayload + 1) //? Adds payload of RED Retransmission into the payload list
//             rtp.push({ payload: REDpayload + 1, codec: "rtx", rate: 90000 }) //? Adds the RED's Retransmission to the RTP
//             fmtp.push({ payload: REDpayload + 1, config: `apt=${REDpayload}` }) //? Retransmission of RED
//             //* PACKET ERROR CORRECTION
//             payloads.push(REDpayload + 2) //? Adds payload of ULPFEC into the payload list
//             rtp.push({ payload: REDpayload + 2, codec: "ulpfec", rate: 90000 }) //? Adds ulpfec to the RTP
//             //* APPLYING NEW CODECS
//             modifiedSDP.media[mediaIndex].payloads = payloads.join(" ")
//             modifiedSDP.media[mediaIndex].rtp = rtp
//             modifiedSDP.media[mediaIndex].fmtp = fmtp
//             modifiedSDP.media[mediaIndex].rtcpFb = generateRTCPFB(rtcpfbPayloads)
//             break
//         case "audio":
//             break
//         default:
//             break
//     }
// })
// const finalizedSDP = write(modifiedSDP).replace("262144", JSON.stringify(quality))
// function fmtpConfigs(codec: "VP8" | "VP9" | "H264-RCDO", quality: number, fps: number) {
//     const extraConfigs = [
//         "sprop-stereo=1",
//         `x-google-start-bitrate=${(quality / 1000) * 0.25}`,
//         `x-google-max-bitrate=${quality / 1000}`,
//         "x-google-max-quantization=40",
//         "x-google-min-quantization=10",
//         "x-google-buffer-initial-delay=1000",
//     ].join(";")
//     const payloadConfigs = {
//         VP8:
//             [
//                 "profile-id=2",
//                 "max-fs=8040",
//                 "qp-min=10",
//                 "qp-max=40",
//                 `max-mbps=${quality / 1000}`,
//                 `max-fr=${fps}`
//             ].concat(extraConfigs).join(";"),
//         VP9: [
//             "profile-id=1",
//             "max-fs=8040", //? Macroblock
//             `max-fr=${fps}`, //? FPS
//         ].concat(extraConfigs).join(";"),
//         "H264-RCDO": [
//             "profile-level-id=01403B",
//             "max-recv-level=403B",
//             "redundant-pic-cap=1",
//             "sprop-level-parameter-sets=PLId1:PSL1:PLId2:PSL2",
//             "use-level-src-parameter-sets=1",
//             "level-asymmetry-allowed=1",
//             "packetization-mode=2",
//             "max-fs=8040", //? Macroblock
//             `max-fr=${fps}`, //? FPS
//             `max-mbps=${8040 / fps}`, //? Macroblock/Frames
//             `max-smbps=${8040 / fps}`, //? Macroblock/Frames
//             `max-cpb=2000`, //? Kbps
//             `max-dpb=${8040 * (6 / 5)}`, //? Macroblock * Sender:8/3 ; Receiver: 3/8 ; Balance: 6/5
//             `max-br=${quality / 1000}`, //? Max bitrate
//             `sprop-interleaving-depth=${32767 * 0.5}`, //? Dependency: packetization-mode=2
//             `sprop-deint-buf-req=${4294967295 * 0.5}`, //? Dependency: sprop-interleaving-depth
//             `deint-buf-cap=${4294967295 * 0.5}`, //? Dependency: sprop-deint-buf-req
//         ].concat(extraConfigs).join(";")
//     }
//     return payloadConfigs[codec]
// }
// function generateRTCPFB(payloads: number[]) {
//     const rtcpFb: MediaAttributes["rtcpFb"] = []
//     const mainType = ["nack", "rtpfb"]
//     const nack = ["pli", "fir"]
//     const rtpfb = ["transport-wide-cc", "ccm-fir", "ccm-nack", "ccm-tmmbr"]
//     for (const payload of payloads) { //? Push payload
//         for (const main of mainType) {
//             rtcpFb.push({ //? Push the main type
//                 payload: payload,
//                 type: main
//             })
//             switch (main) { //? Push the sub types
//                 case "nack":
//                     for (const sub of nack) {
//                         rtcpFb.push({
//                             payload: payload,
//                             type: main,
//                             subtype: sub
//                         })
//                     }
//                     break
//                 case "rtpfb":
//                     for (const sub of rtpfb) {
//                         rtcpFb.push({
//                             payload: payload,
//                             type: main,
//                             subtype: sub
//                         })
//                     }
//                     break
//                 default:
//                     break
//             }
//         }
//     }
//     return rtcpFb
// }
//* OUTPUTS
writeFileSync("./test.txt", JSON.stringify(
    ver1.media[0].payloads
    , null, 2), "utf-8")
// writeJSON("./sdp/test.json", parse(finalizedSDP), { replacer: null, spaces: 2 })