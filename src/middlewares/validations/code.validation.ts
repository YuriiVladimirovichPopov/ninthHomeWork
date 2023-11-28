import { body } from "express-validator";
import { inputValidationErrors } from "../input-validation-middleware";

const codeValidation = body("code")
  .isString()
  .trim()
  .withMessage("invalid code");

export const validateCode = [codeValidation, inputValidationErrors];
