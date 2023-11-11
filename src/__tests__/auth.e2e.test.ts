import request  from "supertest"
import { app } from '../settings';
import { sendStatus } from "../routers/send-status";
import { createUser } from "./user-test-helpers";
import { UserInputModel } from "../models/users/userInputModel";
import { RouterPaths } from "../routerPaths";
import { client } from "../db/db";
import { Db, ObjectId } from 'mongodb';
import express, { response } from "express";
import { emailAdapter } from "../adapters/email-adapter";
import { randomUUID } from "crypto";
import { access } from "fs";

// const getRequest = () => {
//     return request(app)
//     }
// const mockUsersRepository = {
//     findUserByEmail: jest.fn(),
//     };
// const mockEmailManager = {
//     sendEmail: jest.fn(),
//     };
// let db: Db

// const mockUser = {
//     mockUserId: new ObjectId(),
//     login: 'leva',
//     email:'papanchik87@yahoo.com',
//     password: '987654321',
//     emailConfirmation: {
//         confirmationCode: randomUUID(),
//         expirationDate: new Date(),
//         isConfirmed: false,
//       }
// }

// let accessToken: string


// describe('tests for /auth', () => {
//     beforeAll(async () => {
//         await client.close()
//         const connection = await client.connect()
//         db = connection.db()
//         await getRequest()
//         .delete('/testing/all-data')
//         .set('Authorization', 'Basic YWRtaW46cXdlcnR5')

//     })
      
//     afterAll(async () => {
//         await client.close()
//     })

// // пзц какой-то! требуется рефакторинг
//     it (`"auth/registration": 
//         should create new user and send confirmation email with code`, async () => {
//         const mockUserik = {
//             login: mockUser.login,
//             email: mockUser.email,
//             password: mockUser.password
//         }

//         await getRequest()
//         .post(`/auth/registration`)
//         .send(mockUserik)
//         .expect(sendStatus.NO_CONTENT_204) 
//     })

//     it (`"auth/registration": 
//         should return error if email or login already exist`, async () => {
//         const users = await getRequest().get(RouterPaths.users)

//         console.log(users.body, "users")
            
//         await getRequest()
//         .post(`/auth/registration`)
//         .send({
//             login: 'leva',
//             email:'papanchik87@yahoo.com',
//             password: '987654321'
//         })
//         .expect(sendStatus.BAD_REQUEST_400)
//     })

//     it (`"auth/registration-email-resending":
//         should send email with new code if user exists but not confirmed yet;
//         status 204;`, async () => {
            
//             emailAdapter.sendEmail = jest.fn(); 
//             const sendEmailConfirmation = jest.spyOn(emailAdapter, 'sendEmail')  
//            // mockUsersRepository.findUserByEmail.mockResolvedValue(mockUser)
//         await getRequest()
//         .post(`/auth/registration-email-resending`)
//         .send(mockUser.email)
//         .expect(sendStatus.NO_CONTENT_204)
//         //expect(mockUsersRepository.findUserByEmail).toHaveBeenCalledWith(mockUser.email)
//         expect(sendEmailConfirmation).toHaveBeenCalledWith(mockUser.email, expect.any(String))

//     })

//     it (`"auth/registration-confirmation":
//         should confirm registration by email; 
//         status 204`, async () => {
//             await getRequest()
//         .post(`/auth/registration-confirmation`)
//         .send(mockUser.emailConfirmation.confirmationCode)
//         .expect(sendStatus.NO_CONTENT_204)
//     })

//     it (`"auth/registration-confirmation": 
//         should return error if code already confirmed; status 400`, async () => {
//         await getRequest()
//         .post(`/auth/registration-confirmation`)
//         .send({code: '123'})
//         .expect(sendStatus.BAD_REQUEST_400)
//     })

//     it (`"auth/registration-email-resending":
//         should return error if email already confirmed; status 400;`, async () => {
//         await getRequest()
//         .post(`/auth/registration-email-resending`)
//         .send({ email: 'papanchik87@yahoo.com' })
//         .expect(sendStatus.BAD_REQUEST_400)
//     })

//     it.skip (`"auth/registration-confirmation":
//         should return error if code doesnt exist; status 400;`, async () => {
//         await getRequest()
//         .post(`${RouterPaths.auth}/registration-confirmation`)
//         .expect(sendStatus.BAD_REQUEST_400)
//     })
    

//     it (`"auth/login": 
//         should sign in user; 
//         content: JWT 'access' token, JWT 'refresh' token in cookie (http only, secure);
//         status 200;`, async () => {
//             await createUser(mockUser)
        
//             const response = await getRequest()
//         .post(`/auth/login`)
//         .send({loginOrEmail: mockUser.login, password: mockUser.password})
//         .expect(sendStatus.OK_200)
//         expect(response.body.accessToken).toBeDefined()
//         expect(response.headers['set-cookie']).toBeDefined()
//         accessToken = response.body.accessToken
//     })

//     it (`"auth/me": 
//         should return the error when the 'access' token has expired or there is no one in the headers; 
//         status 401`, async () => {
            
//             await getRequest()
//             .get(`/auth/me`)
//             .expect(sendStatus.UNAUTHORIZED_401)
//     })

//     it.skip (`"auth/refresh-token", "/auth/logout": 
//         should return an error when the "refresh" token has expired or there is no one in the cookie; 
//         status 401`, async () => {
//             await getRequest()
//         .post(`${RouterPaths.auth}/refresh-token`)
//         .expect(sendStatus.UNAUTHORIZED_401)
//     })

//     it.skip (`"auth/refresh-token": 
//         should return new 'refresh' and 'access' tokens; status 200; 
//         content: new JWT 'access' token, new JWT 'refresh' token in cookie (http only, secure)`, async () => {
//             await getRequest()
//         .post(`${RouterPaths.auth}/refresh-token`)
//         .expect(sendStatus.OK_200)
//     })

//     it.skip (`"auth/refresh-token", "/auth/logout": 
//         should return an error if the "refresh" token has become invalid; 
//         status 401`, async () => {
//             await getRequest()
//         .post(`${RouterPaths.auth}/logout`)
//         .expect(sendStatus.UNAUTHORIZED_401)
//     })
    
//     it (`"auth/me": should check "access" token and return current user data; 
//     status 200; content: current user data`, async () => {
//         const response = await getRequest()
//         .get(`/auth/me`)
//         .set('Authorization', `Bearer ${accessToken}`)
//         .expect(sendStatus.OK_200)
//         expect(response.body).toEqual({
//             email: mockUser.email,
//             login: mockUser.login,
//             userId: mockUser.mockUserId
//         })
//     })

//     it.skip (`"auth/logout": should make the 'refresh' token invalid; status 204`, async () => {
//         await getRequest()
//         .post(`${RouterPaths.auth}/logout`)
//         .expect(sendStatus.NO_CONTENT_204)
//     })

//     it.skip (` "auth/refresh-token", "/auth/logout": should return an error if the "refresh" token has become invalid; 
//     status 401`, async () => {
//         await getRequest()
//         .post(`${RouterPaths.auth}/logout`)
//         .expect(sendStatus.UNAUTHORIZED_401)
//     })
// })

const getRequest = () => {
    return request(app)
    }
let db: Db

const sleep = (seconds: number) => new Promise((r) => setTimeout(r, seconds * 1000));

describe('tests for /auth', () => {
    beforeAll(async () => {
        await client.close()
        const connection = await client.connect()
        db = connection.db()
        await getRequest()
        .delete('/testing/all-data')
        .set('Authorization', 'Basic YWRtaW46cXdlcnR5')

    })
      
    afterAll(async () => {
        await client.close()
    })

    const endpoints = ['/auth/registration', 
    '/auth/login', '/auth/registration-email-resending', '/auth/registration-confirmation']

    it('should return 429 status code', async () => {
        for (const endpoint of endpoints) {
            for (let i = 0; i <= 5; i++) {
                console.log(endpoint);
                console.log(i);
                const res = await getRequest().post(endpoint).send()
                if(i === 5) {
                    expect(res.status).toBe(sendStatus.TOO_MANY_REQUESTS_429)    
                    await sleep(10.5)
                    const res2 = await getRequest().post(endpoint).send()
                    expect(res2.status).not.toBe(sendStatus.TOO_MANY_REQUESTS_429)  
                } else {
                    expect(res.status).not.toBe(sendStatus.TOO_MANY_REQUESTS_429)       
                }
            }
            
        }
    })

})