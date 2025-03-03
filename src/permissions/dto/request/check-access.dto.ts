import { query } from "express-validator";
import { Types } from "mongoose";

export interface ICheckAccessDto {
  permissionId: Types.ObjectId;
  roleId: Types.ObjectId;
}

export const CheckAccessDto = [
  query("permissionId")
    .isMongoId()
    .withMessage("فرمت آیدی وارد شده برای مجوز صحیح نمیباشد"),

  query("roleId")
    .isMongoId()
    .withMessage("فرمت آیدی وارد شده برای نقش صحیح نمیباشد"),
];
