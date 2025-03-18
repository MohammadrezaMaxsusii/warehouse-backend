import { query } from "express-validator";
import { ListOptionsDto } from "../../shared/dtos/requests/list-options.dto";

export const FindTasksListDto = [
  query("id")
    .optional()
    .isMongoId()
    .withMessage("فرمت آیدی وارد شده صحیح نمیباشد"),

  query("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("نام تسک نمی تواند خالی باشد")
    .isString()
    .withMessage("نام تسک باید متن باشد")
    .toLowerCase(),

  ...ListOptionsDto,
];
