import { Response, Request, Router } from "express";
import { sendStatus } from './send-status';
import { RequestWithBody, RequestWithUser, UsersMongoDbType } from '../types';
import { jwtService } from "../application/jwt-service";
import { authMiddleware } from '../middlewares/validations/auth.validation';
import { UserViewModel } from '../models/users/userViewModel';
import { UserInputModel } from "../models/users/userInputModel";
import { usersRepository } from "../repositories/users-repository";
import { CodeType } from "../models/code";

import { authService } from "../domain/auth-service";
import { validateCode } from "../middlewares/validations/code.validation";
import { emailConfValidation } from "../middlewares/validations/emailConf.validation";
import { emailManager } from "../managers/email-manager";
import { usersCollection } from "../db/db";
import { randomUUID } from 'crypto';
import { add } from "date-fns";
import { error } from 'console';
import { ObjectId } from 'mongodb';
import { createUserValidation } from "../middlewares/validations/users.validation";


export const authRouter = Router ({})

authRouter.post('/login', async(req: Request, res: Response) => {
    const user = await authService.checkCredentials(req.body.loginOrEmail, req.body.password)
        if (user) {
    const token = await jwtService.createJWT(user)
    
    const refreshToken = await jwtService.createRefreshToken(user)
        res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: true})   
        .status(sendStatus.OK_200).send({accessToken: token})
        return
    } else {
        return res.sendStatus(sendStatus.UNAUTHORIZED_401)
    }
})

authRouter.get('/me', authMiddleware, async(req: RequestWithUser<UserViewModel>, res: Response) => {    
    if(!req.user){
        return res.sendStatus(sendStatus.UNAUTHORIZED_401)
    } else {
        return res.status(sendStatus.OK_200)
            .send({
            email: req.user.email,
            login: req.user.login,
            userId: req.user.id
        })
    }
})

authRouter.post('/registration-confirmation', validateCode, async(req: RequestWithBody<CodeType>, res: Response) => {
    const currentDate = new Date()
    
    const user = await usersRepository.findUserByConfirmationCode(req.body.code)
    
    if(!user) {
        return res.status(sendStatus.BAD_REQUEST_400).send({ errorsMessages: [{ message: 'User not found by this code', field: "code" }] })
    } 
    if (user.emailConfirmation.isConfirmed) {
        return res.status(sendStatus.BAD_REQUEST_400).send({ errorsMessages: [{ message: 'Email is confirmed', field: "code" }] })
    }
    if (user.emailConfirmation.expirationDate < currentDate ) {
        return res.status(sendStatus.BAD_REQUEST_400).send({ errorsMessages: [{ message: 'The code is exparied', field: "code" }] })
    }
    if (user.emailConfirmation.confirmationCode !== req.body.code) {  
        return res.status(sendStatus.BAD_REQUEST_400).send({ errorsMessages: [{ message: 'Invalid code', field: "code" }] })
    }
   
    await authService.updateConfirmEmailByUser(user._id.toString())
   

        return res.sendStatus(sendStatus.NO_CONTENT_204)
})

authRouter.post('/registration', createUserValidation, 

    async(req: RequestWithBody<UserInputModel>, res: Response) => {
        
    const user = await authService.createUser(req.body.login, req.body.email, req.body.password)
    
    if (user) {
        return res.sendStatus(sendStatus.NO_CONTENT_204)
    } else {
        return res.sendStatus(sendStatus.BAD_REQUEST_400)
    }
})

authRouter.post('/registration-email-resending', emailConfValidation, 
    async(req: RequestWithBody<UsersMongoDbType>, res: Response) => {
    
    const user = await usersRepository.findUserByEmail(req.body.email)
    if(!user) {
        return res.sendStatus(sendStatus.BAD_REQUEST_400)
    }

    if (user.emailConfirmation.isConfirmed) {
        return res.status(sendStatus.BAD_REQUEST_400).send({info: "isConfirmed" })
    }

    await usersCollection.updateOne({_id: user!._id}, {$set: {
            emailConfirmation: {confirmationCode: randomUUID(),
                                expirationDate: add(new Date(), {
                                    minutes: 60
                                }),
                                isConfirmed: false}}});
    
    const updatedUser = await usersCollection.findOne({_id: user!._id})
    
    try {
        await emailManager.sendEmail(updatedUser!.email, updatedUser!.emailConfirmation.confirmationCode)
    } catch {
        error("email is already confirmed", error)
    }
        return res.sendStatus(sendStatus.NO_CONTENT_204)
})

authRouter.post('/refresh-token', async (req: Request, res: Response) => {
    try {
        const refreshToken = req.cookies.refreshToken
            if (!refreshToken) return res.status(sendStatus.UNAUTHORIZED_401).send({ message: 'Refresh token not found' })
    
        const isValid = await authService.validateRefreshToken(refreshToken);
            if (!isValid) return res.status(sendStatus.UNAUTHORIZED_401).send({ message: 'Invalid refresh token' });

        const user = await usersRepository.findUserById(isValid.userId);
            if(!user) return res.status(sendStatus.UNAUTHORIZED_401).send({ message: 'User not found', isValid: isValid});

        const validToken = await  authService.findTokenInBlackList(user.id, refreshToken);
            if(validToken) return res.status(sendStatus.UNAUTHORIZED_401).send({ message: 'Token'}) 

        const tokens = await authService.refreshTokens(user.id);

        await usersCollection.updateOne({_id: new ObjectId(user.id)}, { $push : { refreshTokenBlackList: refreshToken } })
            res.cookie('refreshToken', tokens.newRefreshToken, {httpOnly: true, secure: true})
                return res.status(sendStatus.OK_200).send({ accessToken: tokens.accessToken })

    } catch(error) {
        return res.status(sendStatus.INTERNAL_SERVER_ERROR_500).send({ message: 'Server error'})
    }
})

authRouter.post('/logout', async (req: Request, res: Response) => {
    try {
        const refreshToken = req.cookies.refreshToken    
           if (!refreshToken) return res.status(sendStatus.UNAUTHORIZED_401).send({ message: 'Refresh token not found' });
      
        const isValid = await authService.validateRefreshToken(refreshToken);    //вынести в мидлевару
            if (!isValid) return res.status(sendStatus.UNAUTHORIZED_401).send({ message: 'Invalid refresh token' });
            
        const user = await usersRepository.findUserById(isValid.userId);
            if(!user) return res.sendStatus(sendStatus.UNAUTHORIZED_401);

        const validToken = await  authService.findTokenInBlackList(user.id, refreshToken); //userId
            if(validToken)return res.sendStatus(sendStatus.UNAUTHORIZED_401); 
    
    await usersCollection.updateOne({_id: new ObjectId(user.id)}, { $push : { refreshTokenBlackList: refreshToken } });
        
            res.clearCookie('refreshToken', { httpOnly: true, secure: true });
            res.sendStatus(sendStatus.NO_CONTENT_204);
    } catch (error) {
        console.error(error)
        return res.status(sendStatus.INTERNAL_SERVER_ERROR_500).send({ message: 'Server error'})
    }
})
