import { body } from "express-validator";
import { Types } from "mongoose";

export interface IAddRoleToPermission {
  permissionId: Types.ObjectId;
  roleId: Types.ObjectId;
}
export const AddRoleToPermissionDto = [
  body("permissionId").isMongoId().withMessage("فرمت آیدی دسترسی نادرست است"),
  body("roleId").isMongoId().withMessage("فرمت آیدی نقش نادرست است"),
];
