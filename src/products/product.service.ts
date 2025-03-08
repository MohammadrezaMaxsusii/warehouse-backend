import { ProductRepository } from "./product.repository";
import { IResponseData } from "../shared/interfaces/response-data.interface";
import httpStatus from "http-status";
import { ListOptions } from "../shared/dtos/requests/list-options.dto";
import _ from "lodash";
import { IParamIdDto } from "../shared/dtos/requests/param-id.dto";
import { PermissionRepository } from "../permissions/permission.repository";
import { RepoFactory } from "../shared";
import {
  ProductErrorMessages,
  ProductSuccessMessages,
} from "./enums/product-messages.enum";
import { IProduct } from "./products.interface";
import { IPayload } from "../auth/interfaces/jwt-payload.interface";
import { Task_Statuses_Enum } from "../tasks/enums/task-statuses.enum";
import { Types } from "mongoose";
import { ProjectRole } from "../shared/enums/project.roles.enum";
import { RoleRepository } from "../roles/role.repository";
import { TaskRepository } from "../tasks/tasks.repository";
import { ProjectRepository } from "../projects/project.repository";
import { taskManagementFlowList } from "../taskMnagement/enums/taskManagement-messages.enum";
import { ITask } from "../tasks/tasks.interface";

const permissionRepo = RepoFactory.getRepo<PermissionRepository>("permission");
const ProductRepo = RepoFactory.getRepo<ProductRepository>("product");
const roleRepo = RepoFactory.getRepo<RoleRepository>("role");
const TaskRepo = RepoFactory.getRepo<TaskRepository>("task");
const ProjectRepo = RepoFactory.getRepo<ProjectRepository>("project");
export const createProduct = async (
  data: Partial<IProduct>,
  payload: IPayload
): Promise<IResponseData> => {
  const projectId = await ProjectRepo.findOne({
    code: data.code,
  });

  const duplicateProduct = await ProductRepo.findOne({
    serialNumber: data.serialNumber,
  });

  if (duplicateProduct) {
    return {
      statusCode: httpStatus.CONFLICT,
      message: ProductErrorMessages.DUPLICATE,
    };
  }
  if (!projectId) {
    return {
      statusCode: httpStatus.NOT_FOUND,
      message: ProductErrorMessages.NOT_FOUND,
    };
  } else {
    const updateProjectProductIds = await ProjectRepo.findOneAndUpdate(
      { code: data.code },
      { $addToSet: { productIds: new Types.ObjectId(data._id) } }
    );
  }

  const assigneeRoleRoleId = await roleRepo.findOne({
    name: ProjectRole.Technical_Manager,
  });

  const result = await ProductRepo.create(data);

  const createTask = await TaskRepo.create({
    description: "محصول را تایید کنید",
    status: Task_Statuses_Enum.TODO,
    assigneeRole: assigneeRoleRoleId?._id,
    assignerRole: new Types.ObjectId(payload.roleIds[0]),
    project: projectId._id,
    products: [result._id],
    taskFlowDesc: taskManagementFlowList.PRUDUCT_CREATE,
  });

  return {
    statusCode: httpStatus.CREATED,
    message: ProductSuccessMessages.CREATED,
    data: result,
  };
};

export const findAllProducts = async (
  inputData: Partial<IProduct> & ListOptions
): Promise<IResponseData> => {
  const { data, options } = ListOptions.prepare(inputData);

  const result = await ProductRepo.findAll(data, options);

  const count = await ProductRepo.countAll(data, options);

  return {
    message: ProductSuccessMessages.LISTED,
    data: result,
    metadata: { totalCount: count },
  };
};

export const findOneProduct = async (
  data: Partial<IProduct>
): Promise<IResponseData> => {
  const result = await ProductRepo.findOne(data);

  if (!result) {
    return {
      statusCode: httpStatus.NOT_FOUND,
      message: ProductErrorMessages.NOT_FOUND,
    };
  }

  return {
    message: ProductSuccessMessages.FOUND,
    data: result,
  };
};

export const updateOneProduct = async (
  data: Partial<IProduct>
): Promise<IResponseData> => {
  const ProductExists = await ProductRepo.findOne(_.pick(data, ["_id"]));

  if (!ProductExists) {
    return {
      statusCode: httpStatus.NOT_FOUND,
      message: ProductErrorMessages.NOT_FOUND,
    };
  }

  const result = (await ProductRepo.findOneAndUpdate(
    _.pick(data, ["_id"]),
    _.omit(data, ["_id"])
  )) as IProduct;

  return {
    message: ProductSuccessMessages.UPDATED,
    data: result,
  };
};

export const deleteOneProduct = async (
  data: Partial<IProduct>
): Promise<IResponseData> => {
  const ProductExists = await ProductRepo.findOne(_.pick(data, ["_id"]));

  if (!ProductExists) {
    return {
      statusCode: httpStatus.NOT_FOUND,
      message: ProductErrorMessages.NOT_FOUND,
    };
  }

  const result = (await ProductRepo.findOneAndSoftDelete(
    _.pick(data, ["_id"])
  )) as IProduct;

  return {
    message: ProductSuccessMessages.DELETED,
    data: result,
  };
};

export const hardDeleteOneProduct = async (
  data: IParamIdDto
): Promise<IResponseData> => {
  const ProductExists = await ProductRepo.findOneAndHardDelete(data);

  if (!ProductExists) {
    return {
      statusCode: httpStatus.NOT_FOUND,
      message: ProductErrorMessages.NOT_FOUND,
    };
  }

  return {};
};
