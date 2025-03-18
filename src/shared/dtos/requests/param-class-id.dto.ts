import { param } from "express-validator";
import { Types } from "mongoose";

export interface IParamClassIdDto {
  classId: Types.ObjectId;
}

export const ParamClassIdDto = [
  param("classId").isMongoId().withMessage("فرمت آیدی کلاس صحیح نمیباشد"),
];
