import { body } from "express-validator";
import { isObjectIdOrHexString } from "mongoose";

export const CreatePermissionDto = [
  body("name")
    .isString()
    .withMessage("نام دسترسی باید رشته باشد")
    .trim()
    .isLength({ max: 128 })
    .withMessage("طول نام حداکثر 128 کاراکتر می باشد"),
  // body("roleIds")
  //   .optional()
  //   .isArray()
  //   .withMessage("نقش ها باید در قالب لیست ارسال شوند")
  //   .custom((value) => {
  //     return isObjectIdOrHexString(value);
  //   })
  //   .withMessage("نوع شناسه معتبر نیست"),
];
