import { Types } from "mongoose";
import { body } from "express-validator";

export interface ICreateStartWorkFlowDto {
  workflowId: Types.ObjectId;
  stepNumber: number;
}

export const createStartWorkFlowDto = [
  body("workflowId").isMongoId().withMessage("شناسه فرآیند معتبر نیست"),
  body("stepNumber").isInt().withMessage("شناسه مرحله معتبر نیست"),
];
