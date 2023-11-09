import dotenv from 'dotenv'
dotenv.config()
import { BlogsMongoDbType, PostsMongoDbType, UsersMongoDbType, CommentsMongoDbType, DeviceMongoDbType, RateLimitMongoDbType } from '../types';
import { Auth, MongoClient } from 'mongodb'
import { AuthViewModel } from '../models/auth';


const url = process.env.mongoUrl 

console.log(url)
if (!url) {
  throw new Error('Url is not exsist')
}

export const client = new MongoClient(url)

export const blogsCollection = client.db().collection<BlogsMongoDbType>('blogs')

export const postsCollection = client.db().collection<PostsMongoDbType>('posts')

export const usersCollection = client.db().collection<UsersMongoDbType>('users')

export const commentsCollection = client.db().collection<CommentsMongoDbType>('comments')

export const authCollection = client.db().collection<AuthViewModel>('auth')

export const tokenCollection = client.db().collection<AuthViewModel>('token')

export const deviceCollection = client.db().collection<DeviceMongoDbType>('device')

export const rateLimitCollection = client.db().collection<RateLimitMongoDbType>('rateLimit')

export const  runDb = async () => {
  try {
    await client.connect();
    console.log('connected successfully to database')
  } catch (err) {
    console.log('error connecting')
    await client.close();
  }
}




