import { parse, write, SessionDescription, parsePayloads } from "sdp-transform"
import { readFileSync, readJSONSync, writeFile, writeFileSync, writeJSON, writeJson } from "fs-extra"
console.clear()
const ver1: SessionDescription = require("./sdp/ver1.json")
const ver3: SessionDescription = require("./sdp/ver3.json")
console.log(ver3.media.length)
writeFileSync("./test.txt", JSON.stringify(
    ver1.media[1].sctpmap.maxMessageSize
    , null, 2), "utf-8")