import { Types } from "mongoose";
import { body } from "express-validator";

// ########################################################

export interface IDeleteWorkflowStepDto {
  workflowId: Types.ObjectId;
  stepNumber: number;
}

export const DeleteWorkflowStepDto = [
  body("workflowId").isMongoId().withMessage("شناسه فرآیند معتبر نیست"),
  body("stepNumber").isInt().withMessage("شناسه مرحله معتبر نیست"),
];

// ########################################################

export interface IDeleteWorkflowStepConditionDto {
  workflowId: Types.ObjectId;
  stepNumber: number;
  conditionId: Types.ObjectId;
}

export const DeleteWorkflowStepConditionDto = [
  body("workflowId").isMongoId().withMessage("شناسه فرآیند معتبر نیست"),
  body("stepNumber").isInt().withMessage("شناسه مرحله معتبر نیست"),
  body("conditionId").isMongoId().withMessage("شناسه شرط معتبر نیست"),
];
