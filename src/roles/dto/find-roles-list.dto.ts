import { query } from "express-validator";
import { ListOptionsDto } from "../../shared/dtos/requests/list-options.dto";

export const FindRolesListDto = [
  query("id")
    .optional()
    .isMongoId()
    .withMessage("فرمت آیدی وارد شده صحیح نمیباشد"),

  query("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("نام نقش نمی تواند خالی باشد")
    .isString()
    .withMessage("نام نقش باید رشته باشد")
    .toLowerCase(),
  
  ...ListOptionsDto,
];
