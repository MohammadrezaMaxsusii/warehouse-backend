import { param } from "express-validator";
import { Types } from "mongoose";

export interface IParamClassSessionIdDto {
  sessionId: Types.ObjectId;
}

export const ParamClassSessionIdDto = [
  param("sessionId")
    .isMongoId()
    .withMessage("فرمت آیدی جلسه ی کلاس صحیح نمیباشد"),
];
