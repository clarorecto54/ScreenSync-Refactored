import { readFileSync } from "fs";
import { NextApiRequest, NextApiResponse } from "next";

export default function Handler(req: NextApiRequest, res: NextApiResponse) {
    const { IP, PORT } = JSON.parse(readFileSync("server.json", "utf-8"))
    res.status(200).json(`http://${IP}:${PORT}`)
    res.status(200).end()
}