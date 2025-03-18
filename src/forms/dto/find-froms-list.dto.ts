import { query } from "express-validator";
import { ListOptionsDto } from "../../shared/dtos/requests/list-options.dto";

export const FindFormsListDto = [
  query("id")
    .optional()
    .isMongoId()
    .withMessage("فرمت آیدی وارد شده صحیح نمیباشد"),

  query("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("نام فرم نمی تواند خالی باشد")
    .isString()
    .withMessage("نام فرم باید رشته باشد")
    .toLowerCase(),
  
  ...ListOptionsDto,
];
