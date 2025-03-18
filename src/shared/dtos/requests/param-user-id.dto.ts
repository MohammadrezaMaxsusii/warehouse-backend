import { param } from "express-validator";
import { Types } from "mongoose";

export interface IParamUserIdDto {
  userId: Types.ObjectId;
}

export const ParamUserIdDto = [
  param("userId").isMongoId().withMessage("فرمت آیدی کاربر صحیح نمیباشد"),
];
