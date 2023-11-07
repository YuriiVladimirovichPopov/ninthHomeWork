import { Request, Response, Router } from "express";

export const securityRouter = Router({})

securityRouter.get('/devices',async (req: Request, res: Response) => {
 /*   
    200	Success

    return [
        {
          "ip": "string",
          "title": "string",
          "lastActiveDate": "string",
          "deviceId": "string"
        }
      ]

    401 If the JWT refreshToken inside cookie is missing, expired or incorrect 
    */
})

securityRouter.delete('/devices',async (req: Request, res: Response) => {
  
/* 
    204	No Content
    
    401	If the JWT refreshToken inside cookie is missing, expired or incorrect
 */
})

securityRouter.delete('/devices/{deviceId}',async (req: Request, res: Response) => {

/* 
204	No Content

401	If the JWT refreshToken inside cookie is missing, expired or incorrect

403	If try to delete the deviceId of other user

404	Not Found
 */

})