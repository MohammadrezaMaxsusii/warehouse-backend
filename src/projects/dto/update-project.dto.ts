import { body } from "express-validator";
import { ParamIdDto } from "../../shared/dtos/requests/param-id.dto";
import { Project_Statuses_Enum } from "../enums/project-statuses.enu";

export const UpdateProjectDto = [
  ...ParamIdDto,

  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("نام پروژه نمی تواند خالی باشد")
    .isString()
    .withMessage("نام پروژه باید متن باشد"),

  body("description")
    .optional()
    .isString()
    .withMessage("توضیحات باید متن باشد"),

  body("code").optional().isString().withMessage("کد پروژه را مشخص کنید"),

  body("status")
    .optional()
    .isIn(Object.values(Project_Statuses_Enum))
    .withMessage("وضعیت ارسال شده معتبر نیست"),

  body("files")
    .optional()
    .isArray()
    .withMessage("فایل های مرتبط با پروژه را آپلود کنید"),

  body("files.*")
    .optional()
    .isMongoId()
    .withMessage("فرمت شناسه فایل صحیح نیست"),

  body("unit").optional().isMongoId().withMessage("فرمت شناسه واحد صحیح نیست"),
];
