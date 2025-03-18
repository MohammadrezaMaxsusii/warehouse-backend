import { param } from "express-validator";
import { Types } from "mongoose";

export interface IParamIdDto {
  _id: Types.ObjectId;
}

export const ParamIdDto = [
  param("id").isMongoId().withMessage("فرمت آیدی وارد شده صحیح نمیباشد"),
];
