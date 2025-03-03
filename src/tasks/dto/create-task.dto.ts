import { body } from "express-validator";

export const CreateTaskDto = [
  body("pid")
    .optional()
    .isMongoId()
    .withMessage("شناسه تسک بالادست را مشخص کنید"),

  body("description").optional().isString().withMessage("توضیحات را وارد کنید"),

  body("assigneeRole").isMongoId().withMessage("شناسه کاربر مقصد را مشخص کنید"),
];
