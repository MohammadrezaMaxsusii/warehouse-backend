import { body } from "express-validator";
import { ParamIdDto } from "../../shared/dtos/requests/param-id.dto";

export const UpdatePermissionDto = [
  ...ParamIdDto,

  body("name")
    .optional()
    .trim()
    .isString()
    .withMessage("نام باید رشته باشد")
    .isLength({ max: 128 })
    .withMessage("نام حداکثر 128 کاراکتر می باشد")
    .toLowerCase(),
];
