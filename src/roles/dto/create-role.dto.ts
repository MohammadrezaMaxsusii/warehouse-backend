import { body } from "express-validator";

export const CreateRoleDto = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("نام نقش نمی تواند خالی باشد")
    .isString()
    .withMessage("نام نقش باید رشته باشد")
    .toLowerCase(),
];
