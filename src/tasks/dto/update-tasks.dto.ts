import { body } from "express-validator";
import { ParamIdDto } from "../../shared/dtos/requests/param-id.dto";

export const UpdateTasksDto = [
  ...ParamIdDto,

  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("نام تسک نمی تواند خالی باشد")
    .isString()
    .withMessage("نام تسک باید متن باشد")
    .toLowerCase(),
];
