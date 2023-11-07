import { body } from "express-validator"
import { inputValidationErrors } from "../input-validation-middleware"
import { blogsRepository } from "../../repositories/blogs-repository"


const titleValidation = body('title')
                                    .isString()
                                    .withMessage('Must be string')
                                    .trim()
                                    .isLength({min: 1, max: 30})
                                    .withMessage('Length must be from 1 to 30 simbols')
const shortDescriptionValidation = body('shortDescription')
                                        .isString()
                                        .withMessage('Must be string')
                                        .trim()
                                        .isLength({min: 1, max: 100})
                                        .withMessage('Length must be from 1 to 100 simbols')
const contentValidation = body('content')
                                        .isString()
                                        .withMessage('Must be string')
                                        .trim()
                                        .isLength({min: 1, max: 1000})
                                        .withMessage('Length must be from 1 to 1000 simbols')  
                                        
const blogIdValidation =  body('blogId')
                                        .isString()
                                        .withMessage('Must be string')
                                        .trim()
                                        .custom(async (id) => {
                                            const blog = await blogsRepository.findBlogById(id);
                                            if (!blog) {
                                                throw Error('Blog is not found');
                                            }
                                            return true;
                                            })

export const createPostValidation = 
    [titleValidation, shortDescriptionValidation, contentValidation, blogIdValidation, inputValidationErrors]
export const updatePostValidation = 
    [titleValidation, shortDescriptionValidation, contentValidation, blogIdValidation, inputValidationErrors]
export const createPostValidationForBlogRouter = 
    [titleValidation, shortDescriptionValidation, contentValidation, inputValidationErrors]





    