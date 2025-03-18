import { body } from "express-validator";
import { ParamIdDto } from "../../shared/dtos/requests/param-id.dto";

export const UpdateFormsDto = [
  ...ParamIdDto,

  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("نام فرم نمی تواند خالی باشد")
    .isString()
    .withMessage("نام فرم باید رشته باشد")
    .toLowerCase(),
];
