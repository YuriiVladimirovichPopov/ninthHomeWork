import { body } from "express-validator";
import { inputValidationErrors } from "../input-validation-middleware";


const nameValidation = body('name')
                                            .isString()
                                            .withMessage('Must be string')
                                            .trim()
                                            .notEmpty()
                                            .isLength({min: 1, max: 15})
                                            .withMessage('Length must be from 1 to 15 simbols')

const descriptionValidation = body('description')
                                            .isString()
                                            .withMessage('Must be string')
                                            .trim()
                                            .notEmpty()
                                            .isLength({min: 1, max: 500})
                                            .withMessage('Length must be from 1 to 500 simbols')

const websiteURLValidation = body('websiteUrl')
                                            .isString()
                                            .withMessage('Must be string')
                                            .isURL({})
                                            .withMessage('Must be a Url')



export const createBlogValidation = [nameValidation, descriptionValidation, websiteURLValidation, inputValidationErrors]
export const updateBlogValidation = [nameValidation, descriptionValidation, websiteURLValidation, inputValidationErrors]