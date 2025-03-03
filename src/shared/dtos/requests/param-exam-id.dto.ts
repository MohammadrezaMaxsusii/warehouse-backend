import { param } from "express-validator";
import { Types } from "mongoose";

export interface IParamExamIdDto {
  examId: Types.ObjectId;
}

export const ParamExamIdDto = [
  param("examId").isMongoId().withMessage("فرمت آیدی آزمون صحیح نمیباشد"),
];
