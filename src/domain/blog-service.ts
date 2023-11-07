import { ObjectId } from "mongodb";
import { BlogInputModel } from "../models/blogs/blogsInputModel";
import { BlogsMongoDbType } from '../types';
import { BlogViewModel } from '../models/blogs/blogsViewModel';
import { blogsRepository } from "../repositories/blogs-repository";
import { PaginatedBlog } from '../models/blogs/paginatedQueryBlog';
import { PaginatedType } from "../routers/helpers/pagination";


export const blogService = {
    
    async findAllBlogs(pagination: PaginatedType): Promise<PaginatedBlog<BlogViewModel[]>> {     //tyt nado dobavit functions
        return await blogsRepository.findAllBlogs(pagination)
    },

    async findBlogById(id: string):Promise<BlogViewModel | null> {
        return await blogsRepository.findBlogById(id)
    },    
    
    async createBlog(data: BlogInputModel): Promise<BlogViewModel> { 
        
        const newBlog: BlogsMongoDbType = {
            _id: new ObjectId(),
            ...data,
            createdAt: new Date().toISOString(),
            isMembership: false,    
        }

        const createdBlog = await blogsRepository.createBlog(newBlog)
        return createdBlog
    },

    async updateBlog(id: string, data: BlogInputModel ): Promise<boolean> {
        return await blogsRepository.updateBlog(id, {...data})
    },
    
    async deleteBlog(id: string): Promise<boolean> {
        return await blogsRepository.deleteBlog(id)
    }, 
    
    async deleteAllBlogs(): Promise<boolean> {
        return await blogsRepository.deleteAllBlogs() 
    }
}