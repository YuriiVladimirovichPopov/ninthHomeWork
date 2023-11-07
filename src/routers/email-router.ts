import { Request, Response, Router } from "express";
import { businessService } from "../domain/business-service";
import { sendStatus } from "./send-status";

export const emailsRouter = Router({})

//emailsRouter.post('/send', async(req: Request, res: Response) => {
//
//    await businessService.doOperation()
//    return res.sendStatus(sendStatus.OK_200)
//})