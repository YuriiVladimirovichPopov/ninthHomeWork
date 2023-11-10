import { NextFunction, Request, Response } from "express";
import { jwtService } from "../../application/jwt-service";
import { sendStatus } from "../../routers/send-status";
import { usersCollection } from "../../db/db";
import { UserViewModel } from '../../models/users/userViewModel';
import { ObjectId } from 'mongodb';


export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if(!req.headers.authorization) {
        return res.sendStatus(sendStatus.UNAUTHORIZED_401)
    }
const typeAuth = req.headers.authorization.split(' ')[0]
    if(typeAuth !== 'Bearer') return res.sendStatus(sendStatus.UNAUTHORIZED_401);

const token = req.headers.authorization.split(' ')[1]

const userId = await jwtService.getUserIdByToken(token)
console.log('token', token) //
    if (!userId) {
        return res.sendStatus(sendStatus.UNAUTHORIZED_401) 
    }
    if (!ObjectId.isValid(userId)) {
        return res.sendStatus(sendStatus.UNAUTHORIZED_401)
    }

const user = await usersCollection.findOne({_id: new ObjectId(userId)})
    if (!user) {
        return res.sendStatus(sendStatus.UNAUTHORIZED_401)
    }
        
const mappedUser: UserViewModel = {
    id: user._id.toString(),
    login: user.login,
    email: user.email,
    createdAt: user.createdAt,
    emailConfirmation: user.emailConfirmation  
}
    req.user = mappedUser
    
    next()
    return;  
}



