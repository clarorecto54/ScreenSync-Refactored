import { parse, write, SessionDescription, parsePayloads } from "sdp-transform"
import { readFileSync, readJSONSync, writeFile, writeFileSync, writeJSON, writeJson } from "fs-extra"
console.clear()
const ver1: SessionDescription = require("./sdp/ver1.json")
const ver3: SessionDescription = require("./sdp/ver3.json")
// console.log(ver1.media[0].rtcpFb.length)
writeFileSync("./test.txt", JSON.stringify(
    ver1.media[0].rtp
    , null, 2), "utf-8")