import { param } from "express-validator";
import { Types } from "mongoose";

export interface IParamPollIdDto {
  pollId: Types.ObjectId;
}

export const ParamPollIdDto = [
  param("pollId").isMongoId().withMessage("فرمت آیدی نظرسنجی صحیح نمیباشد"),
];
