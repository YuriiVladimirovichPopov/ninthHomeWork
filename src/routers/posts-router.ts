import {Request, Response, Router } from "express";
import {sendStatus} from "./send-status";
import { authorizationValidation, 
          inputValidationErrors} from "../middlewares/input-validation-middleware";
import { createPostValidation, updatePostValidation } from '../middlewares/validations/posts.validation';
import { CommentsMongoDbType, RequestWithBody, RequestWithParams } from '../types';
import { PostsInputModel } from "../models/posts/postsInputModel";
import { getByIdParam } from "../models/getById";
import { PostsViewModel } from '../models/posts/postsViewModel';
import { postsService } from "../domain/post-service";
import { queryPostRepository } from "../query repozitory/queryPostsRepository";
import { getPaginationFromQuery } from './helpers/pagination';
import { PaginatedPost } from '../models/posts/paginatedQueryPost';
import { blogsRepository } from "../repositories/blogs-repository";
import { CommentViewModel } from "../models/comments/commentViewModel";
import { PaginatedComment } from "../models/comments/paginatedQueryComment";
import { commentsQueryRepository } from "../query repozitory/queryCommentsRepository";
import { authMiddleware } from "../middlewares/validations/auth.validation";
import { createPostValidationForComment } from '../middlewares/validations/comments.validation';
import { postsRepository } from "../repositories/posts-repository";
import { UserViewModel } from '../models/users/userViewModel';


export const postsRouter = Router({})

postsRouter.get('/:postId/comments', async (req: Request, res: Response<PaginatedComment<CommentViewModel>>) => {
  const foundedPostId = await queryPostRepository.findPostById(req.params.postId)
    if(!foundedPostId) {
    return res.sendStatus(sendStatus.NOT_FOUND_404)
   }
   
  const pagination = getPaginationFromQuery(req.query)
  const allCommentsForPostId: PaginatedComment<CommentViewModel> =
  await commentsQueryRepository.getAllCommentsForPost(req.params.postId, pagination) 
      return res.status(sendStatus.OK_200).send(allCommentsForPostId)
})

postsRouter.post('/:postId/comments', authMiddleware, createPostValidationForComment, async (req: Request, res: Response) => {
  const postWithId: PostsViewModel| null = await queryPostRepository.findPostById(req.params.postId);
    if(!postWithId) {
      return res.sendStatus(sendStatus.NOT_FOUND_404)
    }
  
  const comment: CommentViewModel | null = 
  await postsRepository.createCommentforPostId(
    postWithId.id, 
    req.body.content, 
    { 
      userId: req.user!.id, 
      userLogin: req.user!.login
    }
    )
  
    return res.status(sendStatus.CREATED_201).send(comment)
})

postsRouter.get('/', async (req: Request, res: Response<PaginatedPost<PostsViewModel>>) => {
  const pagination = getPaginationFromQuery(req.query)
  const allPosts: PaginatedPost<PostsViewModel> = await queryPostRepository.findAllPosts(pagination)
    if (!allPosts){
      return res.status(sendStatus.NOT_FOUND_404)
    }
    res.status(sendStatus.OK_200).send(allPosts);
})

//        не меняем    READY
postsRouter.post('/', 
  authorizationValidation,
  createPostValidation,
async (req: RequestWithBody<PostsInputModel>, res: Response<PostsViewModel>) => {
  
  const findBlogById =  await blogsRepository.findBlogById(req.body.blogId)
  
  if (findBlogById) {
    const { title ,shortDescription, content, blogId} = req.body
  const newPost: PostsViewModel | null = await postsService.createPost({title, shortDescription, content, blogId})
  
  if(!newPost) {
    return res.sendStatus(sendStatus.BAD_REQUEST_400)
  }
    return res.status(sendStatus.CREATED_201).send(newPost)
  }
})

//    не меняем      READY
postsRouter.get('/:id', async (req: RequestWithParams<getByIdParam>, res: Response) => {
  const foundPost = await postsService.findPostById(req.params.id)    
    if (!foundPost) {
      res.sendStatus(sendStatus.NOT_FOUND_404)
    } else {
       res.status(sendStatus.OK_200).send(foundPost)
  }
})

 //        не меняем       READY
postsRouter.put('/:id', 
  authorizationValidation,
  updatePostValidation,
async (req: Request<getByIdParam, PostsInputModel>, res: Response<PostsViewModel>) => {
  const updatePost =  await postsService.updatePost(req.params.id, req.body)
    if (!updatePost) {
      return res.sendStatus(sendStatus.NOT_FOUND_404)
    } else {
    res.sendStatus(sendStatus.NO_CONTENT_204)
    }
})

//          не меняем       READY
postsRouter.delete('/:id', 
  authorizationValidation,
  inputValidationErrors,
async (req: RequestWithParams<getByIdParam>, res: Response):Promise<any> => {
const foundPost = await postsService.deletePost(req.params.id)
if (!foundPost) {
  return res.sendStatus(sendStatus.NOT_FOUND_404);
  }
  return res.sendStatus(sendStatus.NO_CONTENT_204)
})