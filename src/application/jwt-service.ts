import jwt from "jsonwebtoken"
import {  settings } from "../settings";
import { UsersMongoDbType } from '../types';

export const jwtService =  {
    async createJWT(user: UsersMongoDbType) {
        const token = jwt.sign({userId: user._id}, settings.accessTokenSecret1, {expiresIn: '10sec'}) 
        return token
    },

    async getUserIdByToken(token: string): Promise<string | null> {
        try {
            const result: any = jwt.verify(token, settings.accessTokenSecret1)
            return result.userId
        } catch (error) {
            return null;
        }
    },
    //todo, may be finished!
    async createRefreshToken(user: UsersMongoDbType) {
        const refToken = jwt.sign({userId: user._id}, settings.refreshTokenSecret2, {expiresIn: '20sec'})  
        return refToken;
    }
}