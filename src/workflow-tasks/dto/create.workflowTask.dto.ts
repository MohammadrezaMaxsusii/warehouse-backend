import { body } from "express-validator";
import { Types } from "mongoose";

export interface ICreateWorkflowTaskDto {
  _id: Types.ObjectId;
  data: any;
}
export const CreateWorkflowTaskDto = [
  body("id")
    .isString()
    .notEmpty()
    .withMessage("شناسه برای اضافه کردن اطلاعات به فرم تعریف نشده است"),
  body("data")
    .isObject()
    .notEmpty()
    .withMessage("اطلاعات برای اضافه کردن به فرم تعریف نشده است"),
];
