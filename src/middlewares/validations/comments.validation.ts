import { body } from "express-validator";
import { inputValidationErrors } from "../input-validation-middleware"; 

export const contentValidation = body('content')
                                    .isString()
                                    .withMessage('Must be string')
                                    .trim()
                                    .isLength({min: 20, max: 300})
                                    .withMessage('Length must be from 20 to 300 simbols')  

export const createPostValidationForComment = [ contentValidation, inputValidationErrors]
                       