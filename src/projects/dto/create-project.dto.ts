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

  body("files").isArray().withMessage("فایل ها باید در قالب لیست ارسال شوند"),

  body("files.*").isMongoId().withMessage("فرمت شناسه فایل صحیح نیست"),
];
