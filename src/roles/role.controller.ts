import { Router } from "express";
import { CreateRoleDto } from "./dto/create-role.dto";
import { ResponseFormatter } from "../shared/middlewares/response-formatter.middelware";
import {
  createRole,
  deleteOneRole,
  findAllRoles,
  findOneRole,
  getPermissions,
  hardDeleteOneRole,
  updateOneRole,
} from "./role.service";
import { FindRolesListDto } from "./dto/find-roles-list.dto";
import { ParamIdDto } from "../shared/dtos/requests/param-id.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";
import { DataValidator } from "../shared/middlewares/data-validator.middleware";
import { Authentication } from "../shared/middlewares/authentication.middleware";
import { Authorization } from "../shared/middlewares/authorization.middleware";
import { rolePermissionsEnum } from "./enums/role-permissions.enum";

const router = Router();

// Create new role
router.post(
  "/create",
  Authentication,
  Authorization(rolePermissionsEnum.CREATE),
  CreateRoleDto,
  DataValidator,
  ResponseFormatter(createRole)
);

// Find roles list
router.get(
  "/list",
  Authentication,
  Authorization(rolePermissionsEnum.LIST),
  FindRolesListDto,
  DataValidator,
  ResponseFormatter(findAllRoles)
);

// Find specific role
router.get(
  "/byId/:id",
  Authentication,
  Authorization(rolePermissionsEnum.FIND_ONE),
  ParamIdDto,
  DataValidator,
  ResponseFormatter(findOneRole)
);

// Update specific role
router.patch(
  "/update/:id",
  Authentication,
  Authorization(rolePermissionsEnum.UPDATE),
  UpdateRoleDto,
  DataValidator,
  ResponseFormatter(updateOneRole)
);

// Delete specific role
router.delete(
  "/delete/:id",
  Authentication,
  Authorization(rolePermissionsEnum.DELETE),
  ParamIdDto,
  DataValidator,
  ResponseFormatter(deleteOneRole)
);

// Hard Delete specific role
router.delete(
  "/delete/hard/:id",
  Authentication,
  Authorization(rolePermissionsEnum.HARD_DELETE),
  ParamIdDto,
  DataValidator,
  ResponseFormatter(hardDeleteOneRole)
);

// Get role permissions
router.get(
  "/get-permissions/:id",
  Authentication,
  Authorization(rolePermissionsEnum.GET_PERMISSIONS),
  ParamIdDto,
  DataValidator,
  ResponseFormatter(getPermissions)
);

export default router;
