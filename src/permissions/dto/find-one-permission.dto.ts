import { param, query } from "express-validator";

export const FindOnePermissionDto = [
  // param("id").optional().isMongoId().withMessage("نوع شناسه معتبر نیست"),
  // query("name").optional().isString(),
];
