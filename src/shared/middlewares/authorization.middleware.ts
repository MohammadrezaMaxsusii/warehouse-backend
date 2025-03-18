import { NextFunction, Response } from "express";
import { PermissionRepository } from "../../permissions/permission.repository";
import { PermissionModel } from "../../permissions/permission.schema";
import { IResponseData } from "../interfaces/response-data.interface";
import { IPayload } from "../../auth/interfaces/jwt-payload.interface";
import httpStatus from "http-status";
import { Types } from "mongoose";
import { RoleRepository } from "../../roles/role.repository";
import { RoleModel } from "../../roles/role.schema";
import { SUPER_ADMIN_ROLE } from "../constants/super-admin-role.constant";
import { RequestWithPayload } from "../interfaces/request-with-payload.interface";
import { RepoFactory } from '../repoFactory';

const permissionRepo = RepoFactory.getRepo<PermissionRepository>("permission");
const roleRepo = RepoFactory.getRepo<RoleRepository>("role");

const errorResponse: IResponseData = {
  data: {},
  error: true,
  message: "دسترسی غیر مجاز",
  statusCode: httpStatus.FORBIDDEN,
};

export const Authorization = (permissionName: string) => {
  return async (req: RequestWithPayload, res: Response, next: NextFunction) => {
    const reqCopy: any = req;

    const payload: IPayload = reqCopy.payload;

    if (!payload || !payload?.roleIds?.length) {
      return res.status(httpStatus.FORBIDDEN).json(errorResponse);
    }

    const isSuperAdmin = await roleRepo.findOne({
      _id: { $in: payload.roleIds.map((id) => new Types.ObjectId(id)) },
      name: SUPER_ADMIN_ROLE,
    });

    if (isSuperAdmin) {
      return next();
    }

    const hasPermission = await permissionRepo.findOne({
      name: permissionName,
      roles: { $in: payload.roleIds.map((id) => new Types.ObjectId(id)) },
    });

    if (!hasPermission) {
      return res.status(httpStatus.FORBIDDEN).json(errorResponse);
    }

    return next();
  };
};
