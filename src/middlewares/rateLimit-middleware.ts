import { Request, Response, NextFunction } from "express";
import { rateLimitCollection } from "../db/db";
import { RateLimitMongoDbType } from "../types";
import { sendStatus } from "../routers/send-status";

const maxRequests = 5
const interval = 10 * 1000
const connections: RateLimitMongoDbType[] = [];

export async function customRateLimit(req: Request, res: Response, next: NextFunction) {
    const IP = req.ip
    const URL = req.url
    const date = new Date().toDateString() // добавил свойство .toDateString() тк ругается что не string

    try {
        const count = await rateLimitCollection.countDocuments({
            IP: IP,
            URL: URL,
            date: {$gte: (new Date(Date.now() - interval))}
        })

        if ( count >= maxRequests ) {
            return res.status(sendStatus.TOO_MANY_REQUESTS_429)
        }
        await rateLimitCollection.insertOne({IP: IP, URL: URL, date: date})
        next()
    } catch (err) {
        console.log(err)
        res.status(sendStatus.INTERNAL_SERVER_ERROR_500)
    }
}