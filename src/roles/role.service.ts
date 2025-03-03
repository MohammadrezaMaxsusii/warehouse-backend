import { RoleRepository } from "./role.repository";
import { IRole } from "./role.interface";
import { IResponseData } from "../shared/interfaces/response-data.interface";
import httpStatus from "http-status";
import {
  RoleErrorMessages,
  RoleSuccessMessages,
} from "./enums/role-messages.enum";
import { ListOptions } from "../shared/dtos/requests/list-options.dto";
import { SUPER_ADMIN_ROLE } from "../shared/constants/super-admin-role.constant";
import _ from "lodash";
import { IParamIdDto } from "../shared/dtos/requests/param-id.dto";
import { PermissionRepository } from "../permissions/permission.repository";
import { RepoFactory } from "../shared";

const permissionRepo = RepoFactory.getRepo<PermissionRepository>("permission");
const roleRepo = RepoFactory.getRepo<RoleRepository>("role");

export const createRole = async (
  data: Partial<IRole>
): Promise<IResponseData> => {
  const duplicateRole = await roleRepo.findOne({ name: data.name });

  if (duplicateRole) {
    return {
      statusCode: httpStatus.CONFLICT,
      message: RoleErrorMessages.DUPLICATE,
    };
  }

  const result = await roleRepo.create(data);

  return {
    statusCode: httpStatus.CREATED,
    message: RoleSuccessMessages.CREATED,
    data: result,
  };
};

export const findAllRoles = async (
  inputData: Partial<IRole> & ListOptions
): Promise<IResponseData> => {
  const { data, options } = ListOptions.prepare(inputData);

  const result = await roleRepo.findAll(data, options);

  const count = await roleRepo.countAll(data, options);

  return {
    message: RoleSuccessMessages.LISTED,
    data: result,
    metadata: { totalCount: count },
  };
};

export const findOneRole = async (
  data: Partial<IRole>
): Promise<IResponseData> => {
  const result = await roleRepo.findOne(data);

  if (!result) {
    return {
      statusCode: httpStatus.NOT_FOUND,
      message: RoleErrorMessages.NOT_FOUND,
    };
  }

  return {
    message: RoleSuccessMessages.FOUND,
    data: result,
  };
};

export const updateOneRole = async (
  data: Partial<IRole>
): Promise<IResponseData> => {
  const roleExists = await roleRepo.findOne(_.pick(data, ["_id"]));

  if (!roleExists) {
    return {
      statusCode: httpStatus.NOT_FOUND,
      message: RoleErrorMessages.NOT_FOUND,
    };
  }

  if (roleExists.name === SUPER_ADMIN_ROLE) {
    return {
      statusCode: httpStatus.FORBIDDEN,
      message: RoleErrorMessages.FORBIDDEN_UPDATE_SUPER_ADMIN_ROLE,
    };
  }

  const duplicateRole = await roleRepo.findOne({ name: data?.name });

  if (
    duplicateRole &&
    roleExists?._id?.valueOf() !== duplicateRole?._id?.valueOf()
  ) {
    return {
      statusCode: httpStatus.CONFLICT,
      message: RoleErrorMessages.DUPLICATE,
    };
  }

  const result = (await roleRepo.findOneAndUpdate(
    _.pick(data, ["_id"]),
    _.omit(data, ["_id"])
  )) as IRole;

  return {
    message: RoleSuccessMessages.UPDATED,
    data: result,
  };
};

export const deleteOneRole = async (
  data: Partial<IRole>
): Promise<IResponseData> => {
  const roleExists = await roleRepo.findOne(_.pick(data, ["_id"]));

  if (!roleExists) {
    return {
      statusCode: httpStatus.NOT_FOUND,
      message: RoleErrorMessages.NOT_FOUND,
    };
  }

  if (roleExists.name === SUPER_ADMIN_ROLE) {
    return {
      statusCode: httpStatus.FORBIDDEN,
      message: RoleErrorMessages.FORBIDDEN_DELETE_SUPER_ADMIN_ROLE,
    };
  }

  const result = (await roleRepo.findOneAndSoftDelete(
    _.pick(data, ["_id"])
  )) as IRole;

  return {
    message: RoleSuccessMessages.DELETED,
    data: result,
  };
};

export const hardDeleteOneRole = async (
  data: IParamIdDto
): Promise<IResponseData> => {
  const roleExists = await roleRepo.findOneAndHardDelete(data);

  if (!roleExists) {
    return {
      statusCode: httpStatus.NOT_FOUND,
      message: RoleErrorMessages.NOT_FOUND,
    };
  }

  return {};
};

export const getPermissions = async (
  data: IParamIdDto
): Promise<IResponseData> => {
  const roleExists = await roleRepo.findOne(data);

  if (!roleExists) {
    return {
      statusCode: httpStatus.NOT_FOUND,
      message: RoleErrorMessages.NOT_FOUND,
    };
  }

  return {
    data: await permissionRepo.getRolePermissions(data._id),
  };
};
