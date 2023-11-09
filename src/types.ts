import { Request } from "express"
import { ObjectId } from 'mongodb';
import { EmailConfirmationType, UserViewModel } from './models/users/userViewModel';


  export type BlogsMongoDbType = {
      _id : ObjectId,
      name: string,
      description: string,
      websiteUrl: string,
      createdAt: string,
      isMembership: boolean 
  }
    
  export type PostsMongoDbType = {
      _id: ObjectId,
      title: string,
      shortDescription: string,
      content: string,
      blogId: string,
      blogName: string,
      createdAt: string
  }

  export type UsersMongoDbType = {
    _id: ObjectId,
    login: string,
    email: string,
    createdAt: string,
    passwordHash: string,
    passwordSalt: string,
    emailConfirmation: EmailConfirmationType,
    refreshTokenBlackList: string[]
  }

  export type createPostDTOType = {         // DTO: data transfer object
      title: string,
      shortDescription: string,
      content: string,
      blogId: string,
      blogName: string,
      createdAt: string
  }

  export type CommentsMongoDbType = {
    _id: ObjectId,       
    postId: string
    content: string,
    commentatorInfo: {
      userId: string,
      userLogin: string
    },
    createdAt: string
  }

  export type DeviceMongoDbType = {
    _id: ObjectId,
    ip: string,
    title: string,
    lastActiveDate: string,
    deviceId: string,
    userId: ObjectId
  }

  export type RateLimitMongoDbType = {
    IP: string,
    URL: string,
    date: string
  }

  export type RegistrationDataType = {
    ip: string
  }





export type RequestWithParams<T> = Request<T,{},{},{},{user: UserViewModel}>
export type RequestWithBody<T> = Request<{}, {}, T>
export type RequestWithUser<U extends UserViewModel> = Request<{}, {}, {}, {},  U>
