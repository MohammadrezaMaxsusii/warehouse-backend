import { body } from "express-validator";

export const CreateProjectDto = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("نام پروژه نمی تواند خالی باشد")
    .isString()
    .withMessage("نام پروژه باید متن باشد"),

  body("description")
    .optional()
    .isString()
    .withMessage("توضیحات باید متن باشد"),

  body("code").isString().withMessage("کد پروژه را مشخص کنید"),

  body("files").isArray().withMessage("فایل های مرتبط با پروژه را آپلود کنید"),

  body("files.*").isMongoId().withMessage("فرمت شناسه فایل صحیح نیست"),

  body("unit").isMongoId().withMessage("فرمت شناسه واحد صحیح نیست"),

  body("dates")
    .optional()
    .isArray()
    .withMessage("تاریخ ها باید در قالب لیست ارسال شوند"),

  body("dates.*.name")
    .optional()
    .isString()
    .withMessage("نام سررسید باید متن باشد"),

  body("dates.*.description")
    .optional()
    .isString()
    .withMessage("توضیحات سررسید باید متن باشد"),

  body("dates.*.startDate")
    .isDate()
    .withMessage("تاریخ شروع سررسید باید تاریخ باشد"),

  body("dates.*.endDate")
    .optional()
    .isDate()
    .withMessage("تاریخ اتمام سررسید باید تاریخ باشد"),

  body("cellPhone").optional().isString().withMessage("شماره تلفن صحیح نیست"),

  body("email").optional().isEmail().withMessage("ایمیل صحیح نیست"),
];
