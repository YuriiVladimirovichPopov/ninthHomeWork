import  express from 'express'
import cors from 'cors'
import { blogsRouter } from './routers/blogs-router';
import { postsRouter } from './routers/posts-router';
import { testingRouter } from './routers/testing-router';
import { usersRouter } from './routers/users-router';
import { authRouter } from './routers/auth-router';
import { commentsRouter } from './routers/comment-router';
import { emailsRouter } from './routers/email-router';
import cookieParser from 'cookie-parser';
import { securityRouter } from './routers/security-router';


export const app = express()
const corsMiddleware = cors();
app.use(corsMiddleware)
const jsonBodyMiddleware = express.json()
app.use(jsonBodyMiddleware)

export const settings = {
    JWT_SECRET: process.env.JWT_SECRET || "1234",
    accessTokenSecret1: process.env.ACCESS_TOKEN_SECRET || "1235",
    refreshTokenSecret2: process.env.REFRESH_TOKEN_SEC || "9876"
}

app.use(cookieParser())

app.use('/blogs', blogsRouter)

app.use('/posts', postsRouter)

app.use('/users', usersRouter)

app.use('/auth', authRouter)

app.use('/security', securityRouter)

app.use('/comments', commentsRouter)

app.use('/emails', emailsRouter)

app.use('/testing', testingRouter)

