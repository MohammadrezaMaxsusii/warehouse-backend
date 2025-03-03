import { Router } from "express";
import {
  addRole,
  ChangeAmount,
  checkUserWithRoleAndPermission,
  createUser,
  deleteOneUser,
  findAllUsers,
  findOneUser,
  GetAmount,
  getMyselfInfo,
  hardDeleteOneUser,
  removeRole,
  updateOneUser,
} from "./user.service";
import { CreateUserDto } from "./dto/request/create-user.dto";
import { DataValidator } from "../shared/middlewares/data-validator.middleware";
import { ResponseFormatter } from "../shared/middlewares/response-formatter.middelware";
import { FindUsersListDto } from "./dto/request/find-users-list.dto";
import { UpdateUserDto } from "./dto/request/update-user.dto";
import { ParamIdDto } from "../shared/dtos/requests/param-id.dto";
import { CheckUserRolePermissionDto } from "./dto/request/check-user-with-role-permission.dto";
import { AddRoleToUserDto } from "./dto/request/add-role-to-user.dto";
import { RemoveRoleFromUserDto } from "./dto/request/remove-role-from-user.dto";
import { Authentication } from "../shared/middlewares/authentication.middleware";
import { Authorization } from "../shared/middlewares/authorization.middleware";
import { ChangeUserAmountDto } from "./dto/request/amount-user.dto";
import { userPermissionsEnum } from "./enums/user-permissions.enum";

const router = Router();

// Create new user
router.post(
  "/create",
  Authentication,
  Authorization(userPermissionsEnum.CREATE),
  CreateUserDto,
  DataValidator,
  ResponseFormatter(createUser)
);

// Find user list
router.get(
  "/list",
  Authentication,
  Authorization(userPermissionsEnum.LIST),
  FindUsersListDto,
  DataValidator,
  ResponseFormatter(findAllUsers)
);

// Find One user
router.get(
  "/byId/:id",
  Authentication,
  Authorization(userPermissionsEnum.FIND_ONE),
  ParamIdDto,
  DataValidator,
  ResponseFormatter(findOneUser)
);

// Update user
router.patch(
  "/update/:id",
  Authentication,
  Authorization(userPermissionsEnum.UPDATE),
  UpdateUserDto,
  DataValidator,
  ResponseFormatter(updateOneUser)
);

// Delete user
router.delete(
  "/delete/:id",
  Authentication,
  Authorization(userPermissionsEnum.DELETE),
  ParamIdDto,
  DataValidator,
  ResponseFormatter(deleteOneUser)
);

// Hard Delete specific role
router.delete(
  "/delete/hard/:id",
  Authentication,
  Authorization(userPermissionsEnum.HARD_DELETE),
  ParamIdDto,
  DataValidator,
  ResponseFormatter(hardDeleteOneUser)
);

// check access of a user by a role and a permission
router.get(
  "/access-check",
  Authentication,
  Authorization(userPermissionsEnum.ACCESS_CHECK),
  CheckUserRolePermissionDto,
  DataValidator,
  ResponseFormatter(checkUserWithRoleAndPermission)
);

// add role to user
router.post(
  "/addRole",
  Authentication,
  Authorization(userPermissionsEnum.ADD_ROLE),
  AddRoleToUserDto,
  DataValidator,
  ResponseFormatter(addRole)
);

// reomev role from user
router.delete(
  "/removeRole",
  Authentication,
  Authorization(userPermissionsEnum.REMOVE_ROLE),
  RemoveRoleFromUserDto,
  DataValidator,
  ResponseFormatter(removeRole)
);

// get user's self info
router.get(
  "/myself",
  Authentication,
  // Authorization(userPermissionsEnum.REMOVE_ROLE),
  // RemoveRoleFromUserDto,
  // DataValidator,
  ResponseFormatter(getMyselfInfo)
);

router.post(
  "/setAmount",
  Authentication,
  Authorization(userPermissionsEnum.SET_AMOUNT),
  ChangeUserAmountDto,
  DataValidator,
  ResponseFormatter(ChangeAmount)
);

router.get(
  "/getAmount/:id",
  Authentication,
  Authorization(userPermissionsEnum.GET_AMOUNT),
  ParamIdDto,
  DataValidator,
  ResponseFormatter(GetAmount)
);

export default router;
