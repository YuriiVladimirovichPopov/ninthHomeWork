import { Request, Response, NextFunction } from "express";
import { RateLimitMongoDbType } from "../types";
import { sendStatus } from "../routers/send-status";
import { rateLimitCollection } from "../db/db";

const maxRequests = 5;
const interval = 10 * 1000;
const connections: RateLimitMongoDbType[] = [];

export async function customRateLimit(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const IP = req.ip;
  const URL = req.url;
  const date = new Date();

  try {
    const count = await rateLimitCollection.countDocuments({
        IP: IP,
        URL: URL,
        date: {$gte: new Date(+date - interval)}    // +date === integer
    })
    /* const count = connections.filter(
      (c) =>
        c.IP === IP && c.URL === URL && c.date >= new Date(+date - interval)
    ).length;
 */
    if (count + 1 > maxRequests) {
      return res.sendStatus(sendStatus.TOO_MANY_REQUESTS_429);
    }
     await rateLimitCollection.insertOne({IP: IP, URL: URL, date: date})
    connections.push({ IP, URL, date });
    next();
  } catch (err) {
    console.log(err);
    res.sendStatus(sendStatus.INTERNAL_SERVER_ERROR_500);
  }
}
