import { body } from "express-validator";

export const CreateStoreDto = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("نام انبار نمی تواند خالی باشد")
    .isString()
    .withMessage("نام انبار باید رشته باشد")
    .toLowerCase(),
];
