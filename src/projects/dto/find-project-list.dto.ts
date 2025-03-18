import { query } from "express-validator";
import { ListOptionsDto } from "../../shared/dtos/requests/list-options.dto";
import { Project_Statuses_Enum } from "../enums/project-statuses.enu";

export const FindProjectsListDto = [
  query("id")
    .optional()
    .isMongoId()
    .withMessage("فرمت آیدی وارد شده صحیح نمیباشد"),

  query("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("نام پروژه نمی تواند خالی باشد")
    .isString()
    .withMessage("نام پروژه باید متن باشد"),

  query("description")
    .optional()
    .isString()
    .withMessage("توضیحات باید متن باشد"),

  query("code").optional().isString().withMessage("کد پروژه را مشخص کنید"),

  query("status").optional().isIn(Object.values(Project_Statuses_Enum)),

  ...ListOptionsDto,
];
