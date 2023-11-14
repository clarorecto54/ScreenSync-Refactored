import { readFileSync } from "fs";
import { NextApiRequest, NextApiResponse } from "next";

export default function Handler(req: NextApiRequest, res: NextApiResponse) {
    const data = JSON.parse(readFileSync("server.json", "utf-8"))
    res.status(200).json(data)
    res.status(200).end()
}