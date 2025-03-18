import { body } from "express-validator";
import { ParamIdDto } from "../../shared/dtos/requests/param-id.dto";

export const UpdateUnitDto = [
  ...ParamIdDto,

  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("نام واحد نمی تواند خالی باشد")
    .isString()
    .withMessage("نام واحد باید رشته باشد")
    .toLowerCase(),
];
