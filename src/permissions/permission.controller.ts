import { Router } from "express";
import {
  addRoleToPermission,
  checkAccessRoleToPermission,
  createPermission,
  deleteOnePermission,
  findAllPermissions,
  findOnePermission,
  hardDeleteOnePermission,
  removeRoleFromPermission,
  updateOnePermission,
} from "./permission.service";
import { DataValidator } from "../shared/middlewares/data-validator.middleware";
import { ResponseFormatter } from "../shared/middlewares/response-formatter.middelware";
import { CreatePermissionDto } from "./dto/create-permission.dto";
import { FindOnePermissionDto } from "./dto/find-one-permission.dto";
import { FindPermissionsListDto } from "./dto/find-permissions-list.dto";
import { UpdatePermissionDto } from "./dto/update-permission.dto";
import { DeletePermissionDto } from "./dto/delete-permission.dto";
import { AddRoleToPermissionDto } from "./dto/add-role.dto";
import { RemoveRoleFromPermissionDto } from "./dto/remvoe-role.dto";
import { ParamIdDto } from "../shared/dtos/requests/param-id.dto";
import { CheckAccessDto } from "./dto/request/check-access.dto";
import { Authentication } from "../shared/middlewares/authentication.middleware";
import { Authorization } from "../shared/middlewares/authorization.middleware";
import { permissionPermissionsEnum } from "./enums/permission-permissions.enum";

const router = Router();

// Create new permission
router.post(
  "/create",
  Authentication,
  Authorization(permissionPermissionsEnum.CREATE),
  CreatePermissionDto,
  DataValidator,
  ResponseFormatter(createPermission)
);

// Find permission list
router.get(
  "/list",
  Authentication,
  Authorization(permissionPermissionsEnum.LIST),
  FindPermissionsListDto,
  DataValidator,
  ResponseFormatter(findAllPermissions)
);

// Find One permission
router.get(
  "/byId/:id",
  Authentication,
  Authorization(permissionPermissionsEnum.FIND_ONE),
  ParamIdDto,
  DataValidator,
  ResponseFormatter(findOnePermission)
);

// Find permission list
router.patch(
  "/update/:id",
  Authentication,
  Authorization(permissionPermissionsEnum.UPDATE),
  UpdatePermissionDto,
  DataValidator,
  ResponseFormatter(updateOnePermission)
);

// Soft delete permission
router.delete(
  "/delete/:id",
  Authentication,
  Authorization(permissionPermissionsEnum.DELETE),
  ParamIdDto,
  DataValidator,
  ResponseFormatter(deleteOnePermission)
);

// Hard delete permission
router.delete(
  "/delete/hard/:id",
  Authentication,
  Authorization(permissionPermissionsEnum.HARD_DELETE),
  ParamIdDto,
  DataValidator,
  ResponseFormatter(hardDeleteOnePermission)
);

// add new role to permission
router.post(
  "/addRole",
  Authentication,
  Authorization(permissionPermissionsEnum.ADD_ROLE),
  AddRoleToPermissionDto,
  DataValidator,
  ResponseFormatter(addRoleToPermission)
);

// remove role from permission
router.delete(
  "/removeRole",
  Authentication,
  Authorization(permissionPermissionsEnum.REMOVE_ROLE),
  RemoveRoleFromPermissionDto,
  DataValidator,
  ResponseFormatter(removeRoleFromPermission)
);

// check access specific role to permission
router.get(
  "/access-check",
  Authentication,
  Authorization(permissionPermissionsEnum.ACCESS_CHECK),
  CheckAccessDto,
  DataValidator,
  ResponseFormatter(checkAccessRoleToPermission)
);

export default router;
