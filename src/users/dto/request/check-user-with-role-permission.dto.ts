import { query } from "express-validator";
import { Types } from "mongoose";

export interface ICheckUserRolePermission {
  userId: Types.ObjectId;
  roleId: Types.ObjectId;
  permissionId: Types.ObjectId;
}
export const CheckUserRolePermissionDto = [
  query("userId").isMongoId().withMessage("فرمت شناسه کاربر صحیح نیست"),
  query("roleId").isMongoId().withMessage("فرمت شناسه نقش صحیح نیست"),
  query("permissionId").isMongoId().withMessage("فرمت شناسه دسترسی صحیح نیست"),
];
