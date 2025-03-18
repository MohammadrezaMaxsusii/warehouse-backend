import { PermissionRepository } from "./permission.repository";
import { IPermission } from "./permission.interface";
import { IResponseData } from "../shared/interfaces/response-data.interface";
import httpStatus from "http-status";
import { ListOptions } from "../shared/dtos/requests/list-options.dto";
import _ from "lodash";
import { IAddRoleToPermission } from "./dto/add-role.dto";
import { uniqueArray } from "../shared/utils/functions/unique-array-items.function";
import { Types } from "mongoose";
import { IRemoveRoleFromPermission } from "./dto/remvoe-role.dto";
import { RoleRepository } from "../roles/role.repository";
import { ICheckAccessDto } from "./dto/request/check-access.dto";
import { IParamIdDto } from "../shared/dtos/requests/param-id.dto";
import { RepoFactory } from "../shared";

const permissionRepo = RepoFactory.getRepo<PermissionRepository>("permission");
const roleRepo = RepoFactory.getRepo<RoleRepository>("role");

export const createPermission = async (
  data: Partial<IPermission>
): Promise<IResponseData> => {
  const duplicatePermission = await permissionRepo.findOne({
    name: data.name,
  });

  if (duplicatePermission) {
    return {
      statusCode: httpStatus.CONFLICT,
      message: "نام دسترسی تکراری است",
    };
  }

  const result = await permissionRepo.create(data);

  return {
    statusCode: httpStatus.CREATED,
    message: "دسترسی ایجاد شد",
    data: result,
  };
};

export const findOnePermission = async (
  data: Partial<IPermission>
): Promise<IResponseData> => {
  const result = await permissionRepo.findOne(data);

  if (!result) {
    return {
      statusCode: httpStatus.NOT_FOUND,
      message: "دسترسی پیدا نشد",
    };
  }

  return {
    data: result,
  };
};

export const findAllPermissions = async (
  inputData: Partial<IPermission> & ListOptions
): Promise<IResponseData> => {
  const { data, options } = ListOptions.prepare(inputData);

  const result = await permissionRepo.findAll(data, options);

  const count = await permissionRepo.countAll(data, options);

  return {
    data: result,
    metadata: { totalCount: count },
  };
};

export const updateOnePermission = async (
  data: Partial<IPermission>
): Promise<IResponseData> => {
  const permissionExists = await permissionRepo.findOne(_.pick(data, ["_id"]));

  if (!permissionExists) {
    return {
      statusCode: httpStatus.NOT_FOUND,
      message: "دسترسی با این شناسه پیدا نشد",
    };
  }

  const result = (await permissionRepo.findOneAndUpdate(
    _.pick(data, ["_id"]),
    _.omit(data, ["_id"])
  )) as IPermission;

  return {
    data: result,
  };
};

export const deleteOnePermission = async (
  data: Partial<IPermission>
): Promise<IResponseData> => {
  const permissionExists = await permissionRepo.findOne(_.pick(data, ["_id"]));

  if (!permissionExists) {
    return {
      statusCode: httpStatus.NOT_FOUND,
      message: "دسترسی با این شناسه پیدا نشد",
    };
  }

  const result = (await permissionRepo.findOneAndSoftDelete(
    _.pick(data, ["_id"])
  )) as IPermission;

  return {
    data: result,
  };
};

export const hardDeleteOnePermission = async (
  data: IParamIdDto
): Promise<IResponseData> => {
  const permissionExists = await permissionRepo.findOneAndHardDelete(data);

  if (!permissionExists) {
    return {
      statusCode: httpStatus.NOT_FOUND,
      message: "دسترسی با این شناسه پیدا نشد",
    };
  }

  return {};
};

export const addRoleToPermission = async (
  data: IAddRoleToPermission
): Promise<IResponseData> => {
  data.permissionId = new Types.ObjectId(data.permissionId);
  data.roleId = new Types.ObjectId(data.roleId);

  const permissionExists = await permissionRepo.findOne({
    _id: data.permissionId,
  });

  if (!permissionExists) {
    return {
      statusCode: httpStatus.NOT_FOUND,
      message: "دسترسی با این شناسه پیدا نشد",
    };
  }

  const roleExists = await roleRepo.findOne({
    _id: data.roleId,
  });

  if (!roleExists) {
    return {
      statusCode: httpStatus.NOT_FOUND,
      message: "نقش با این شناسه پیدا نشد",
    };
  }

  if (Array.isArray(permissionExists.roles)) {
    const allRoleIds = uniqueArray([
      ...permissionExists.roles.map((item) => item._id?.toString() as string),
      data.roleId.toString(),
    ]).map((item) => new Types.ObjectId(item as string));

    await permissionRepo.findOneAndUpdate(
      { _id: data.permissionId },
      {
        roles: allRoleIds,
      }
    );
  } else {
    await permissionRepo.findOneAndUpdate(
      {
        _id: data.permissionId,
      },
      {
        roles: [data.roleId],
      }
    );
  }

  return {
    statusCode: httpStatus.CREATED,
  };
};

export const removeRoleFromPermission = async (
  data: IRemoveRoleFromPermission
): Promise<IResponseData> => {
  data.permissionId = new Types.ObjectId(data.permissionId);
  data.roleId = new Types.ObjectId(data.roleId);

  const permissionExists = await permissionRepo.findOne({
    _id: data.permissionId,
  });

  if (!permissionExists) {
    return {
      statusCode: httpStatus.NOT_FOUND,
      message: "دسترسی با این شناسه پیدا نشد",
    };
  }

  const roleExists = await roleRepo.findOne({
    _id: data.roleId,
  });

  if (!roleExists) {
    return {
      statusCode: httpStatus.NOT_FOUND,
      message: "نقش با این شناسه پیدا نشد",
    };
  }

  if (Array.isArray(permissionExists.roles)) {
    const allRoleIds = [...permissionExists.roles]
      .map((item) => item._id?.toString())
      .filter((id) => id !== data.roleId.toString())
      .map((id) => new Types.ObjectId(id));

    await permissionRepo.findOneAndUpdate(
      { _id: data.permissionId },
      {
        roles: allRoleIds,
      }
    );
  }

  return {};
};

export const checkAccessRoleToPermission = async (
  data: Partial<ICheckAccessDto>
): Promise<IResponseData> => {
  data.permissionId = new Types.ObjectId(data.permissionId);
  data.roleId = new Types.ObjectId(data.roleId);

  const permissionExists = await permissionRepo.findOne({
    _id: data.permissionId,
  });

  if (!permissionExists) {
    return {
      statusCode: httpStatus.NOT_FOUND,
      message: "مجوز پیدا نشد",
    };
  }

  const roleExists = await roleRepo.findOne({ _id: data.roleId });

  if (!roleExists) {
    return {
      statusCode: httpStatus.NOT_FOUND,
      message: "نقش پیدا نشد",
    };
  }

  const roleHasThisPermission = permissionExists.roles?.some(
    (role) => role._id?.toString() === data.roleId?.toString()
  );

  if (!roleHasThisPermission) {
    return {
      message: "این نقش به این مجوز دسترسی ندارد",
      data: { access: false },
    };
  }

  return {
    message: "این نقش به این مجوز دسترسی دارد",
    data: { access: true },
  };
};
