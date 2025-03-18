import { body } from "express-validator";


export const CreateRoutessDto = [

  body("method")
    .trim()
    .notEmpty()
    .withMessage("متد نمی تواند خالی باشد")
    .isString()
    .withMessage(" متد باید رشته باشد")
    .toLowerCase(),
    body("path")
    .trim()
    .notEmpty()
    .isString().withMessage("مسیر نمی تواند خالی باشد")
];


export interface ICreateRoutesDto {
    method: string;
    path: string;
}