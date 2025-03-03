import { body } from "express-validator";
import { ParamIdDto } from "../../shared/dtos/requests/param-id.dto";

export const UpdateRoleDto = [
  ...ParamIdDto,

  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("نام نقش نمی تواند خالی باشد")
    .isString()
    .withMessage("نام نقش باید رشته باشد")
    .toLowerCase(),
];
