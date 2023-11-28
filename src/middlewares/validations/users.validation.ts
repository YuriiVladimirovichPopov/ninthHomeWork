import { body } from "express-validator";
import { inputValidationErrors } from "../input-validation-middleware";
import { usersRepository } from "../../repositories/users-repository";

const loginValidation = body("login")
  .isString()
  .isLength({ min: 3, max: 10 })
  .trim()
  .withMessage("incorrect login")
  .custom(async (login) => {
    const user = await usersRepository.findByLoginOrEmail(login);
    if (user) {
      throw new Error("User already exists");
    }
    return true;
  });

const passwordValidation = body("password")
  .isString()
  .isLength({ min: 6, max: 20 })
  .trim()
  .withMessage("incorrect password");

const emailValidation = body("email")
  .isString()
  .trim()
  .isEmail()
  .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
  .withMessage("incorrect email")
  .custom(async (email) => {
    const user = await usersRepository.findByLoginOrEmail(email);
    if (user) {
      throw new Error("User already exists");
    }
    return true;
  });

const loginOrEmailValidation = body("loginOrEmail")
  .isString()
  .trim()
  .isLength({ min: 3, max: 30 });

export const loginUserValidation = [loginOrEmailValidation, passwordValidation];
export const createUserValidation = [
  loginValidation,
  passwordValidation,
  emailValidation,
  inputValidationErrors,
];
export const updateUserValidation = [
  loginValidation,
  passwordValidation,
  emailValidation,
  inputValidationErrors,
];
