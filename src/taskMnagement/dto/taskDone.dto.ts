import { body } from "express-validator";
import { Types } from "mongoose";

export interface ITaskDoneDto {
  taskId: Types.ObjectId;
  taskCheck: "verify" | "reject";
}

export const taskDoneDto = [
  body("taskId").isMongoId().withMessage("شناسه وظیفه وارد نشده است"),
  body("taskCheck")
    .isIn(["verify", "reject"])
    .withMessage("وضعیت وظیفه صحیح نیست"),
];
