import { body } from "express-validator";

export const DeletePermissionDto = [
  body("id").isMongoId().withMessage("فرمت آیدی وارد شده صحیح نمیباشد"),
];
