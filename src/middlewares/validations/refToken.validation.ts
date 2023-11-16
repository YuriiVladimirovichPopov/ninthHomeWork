import { NextFunction, Request, Response } from "express";
import { sendStatus } from "../../routers/send-status";
import { authService } from "../../domain/auth-service";
import { usersRepository } from "../../repositories/users-repository";
import { deviceCollection } from "../../db/db";
import { jwtService } from "../../application/jwt-service";




export async function refTokenMiddleware (req: Request, res: Response, next: NextFunction)  {
    try {
        const refreshToken = req.cookies.refreshToken   
           if (!refreshToken) return res.status(sendStatus.UNAUTHORIZED_401)
                .send({ message: 'Refresh token not found' });
      
        const isValid = await authService.validateRefreshToken(refreshToken);    
            if (!isValid) return res.status(sendStatus.UNAUTHORIZED_401)
                .send({ message: 'Invalid refresh token' });
            
        const user = await usersRepository.findUserById(isValid.userId);
            if(!user) return res.status(sendStatus.UNAUTHORIZED_401)
                .send({ message: 'User not found', isValid: isValid});

        const device = await deviceCollection.findOne({ deviceId: isValid.deviceId })
            if(!device) return res.status(sendStatus.UNAUTHORIZED_401)
                .send({ message: 'No device' })
    
        const lastActiveDate = await jwtService.getLastActiveDate(refreshToken)
            if (lastActiveDate !== device.lastActiveDate) 
                return res.status(sendStatus.UNAUTHORIZED_401)
                    .send({message: 'Invalid refresh token version'})
     req.user = user 
     req.deviceId = device.deviceId         
    next()
} catch (err) {
    console.log(err)
    return res.sendStatus(sendStatus.INTERNAL_SERVER_ERROR_500)
}
}