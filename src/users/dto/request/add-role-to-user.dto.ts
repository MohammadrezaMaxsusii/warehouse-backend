import { body } from "express-validator";
import { Types } from "mongoose";

export interface IAddRoleToUser {
  userId: Types.ObjectId;
  roleId: Types.ObjectId;
}
export const AddRoleToUserDto = [
  body("userId").isMongoId().withMessage("فرمت شناسه کاربر صحیح نیست"),
  body("roleId").isMongoId().withMessage("فرمت شناسه نقش صحیح نیست"),
];
