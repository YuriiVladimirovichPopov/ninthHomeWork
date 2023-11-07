import { PostsInputModel } from '../models/posts/postsInputModel';
import { PostsViewModel } from '../models/posts/postsViewModel';
import { blogsRepository } from '../repositories/blogs-repository';
import { postsRepository } from '../repositories/posts-repository';
import { queryPostRepository } from '../query repozitory/queryPostsRepository';
import { PaginatedPost } from '../models/posts/paginatedQueryPost';
import { PaginatedType } from '../routers/helpers/pagination';
 
 
 export const postsService = {

    async findAllPosts(pagination: PaginatedType): Promise<PaginatedPost<PostsViewModel>> {
        
         return await queryPostRepository.findAllPosts(pagination)
    },

    async findPostById( id: string): Promise<PostsViewModel | null> {
        
         return await queryPostRepository.findPostById(id)
    },
    async createPost( data: PostsInputModel): Promise<PostsViewModel | null> {
     const blog = await blogsRepository.findBlogById(data.blogId)
          if(!blog) return null;

     const newPost = {
         ... data,
         blogName: blog.name,
         createdAt: new Date().toISOString(), 
     }
          const createdPost = await postsRepository.createdPostForSpecificBlog(data) 
         
      return createdPost;
 },
 
    
    async updatePost(id: string, data: PostsInputModel): Promise<PostsViewModel | boolean> {
        
         return await postsRepository.updatePost(id, {...data})
    },
    async deletePost(id: string): Promise<PostsViewModel | boolean> {
        
         return await postsRepository.deletePost(id)
    },
    async deleteAllPosts(): Promise<boolean> {
       
          return await postsRepository.deleteAllPosts() 
        }
    }
 

