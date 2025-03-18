import { param } from "express-validator";
import { Types } from "mongoose";

export interface IParamItemIdDto {
  itemId: Types.ObjectId;
}

export const ParamItemIdDto = [
  param("itemId").isMongoId().withMessage("فرمت آیدی آیتم صحیح نمیباشد"),
];
