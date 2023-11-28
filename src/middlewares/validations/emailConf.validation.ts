import { body } from "express-validator";
import { inputValidationErrors } from "../input-validation-middleware";
import { usersRepository } from "../../repositories/users-repository";

const emailConfirmationValidation = body("email")
  .isString()
  .trim()
  .isEmail()
  .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
  .withMessage("incorrect email")
  .custom(async (email) => {
    const user = await usersRepository.findByLoginOrEmail(email);
    if (!user) {
      throw Error(`'User doesn't exist'`);
    }
    if (user.emailConfirmation.isConfirmed) {
      throw Error("email by user already confirmed");
    }
    return true;
  });

export const emailConfValidation = [
  emailConfirmationValidation,
  inputValidationErrors,
];
