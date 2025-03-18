import { query } from "express-validator";
import { ListOptionsDto } from "../../shared/dtos/requests/list-options.dto";

export const FindPermissionsListDto = [
  query("id")
    .optional()
    .isMongoId()
    .withMessage("فرمت آیدی وارد شده صحیح نمیباشد"),

  query("name").optional().trim().isString().withMessage("نام باید رشته باشد"),

  ...ListOptionsDto,
];
