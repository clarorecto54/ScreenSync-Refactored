import { parse, write, SessionDescription, MediaAttributes } from "sdp-transform"
import { readFileSync, readJSONSync, writeFile, writeFileSync, writeJSON, writeJson } from "fs-extra"
import * as fs from "fs"
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
const test = 1
if (test) {
    console.log("Dang")
}
//* OUTPUTS
writeFileSync("./test.txt", JSON.stringify(
    ver1.media[0].payloads
    , null, 2), "utf-8")
// writeJSON("./sdp/test.json", parse(finalizedSDP), { replacer: null, spaces: 2 })