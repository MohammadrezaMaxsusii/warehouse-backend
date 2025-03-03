import { IResponseData } from "../shared/interfaces/response-data.interface";
import httpStatus from "http-status";
import { ListOptions } from "../shared/dtos/requests/list-options.dto";
import _ from "lodash";
import { IParamIdDto } from "../shared/dtos/requests/param-id.dto";
import { PermissionRepository } from "../permissions/permission.repository";
import { RepoFactory } from "../shared";
import { TaskRepository } from "./tasks.repository";
import { ITask } from "./tasks.interface";
import {
  TaskErrorMessages,
  TaskSuccessMessages,
} from "./enums/tasks-messages.enum";
import { Task_Statuses_Enum } from "./enums/task-statuses.enum";

const permissionRepo = RepoFactory.getRepo<PermissionRepository>("permission");
const taskRepo = RepoFactory.getRepo<TaskRepository>("task");

export const createTask = async (
  data: Partial<ITask>
): Promise<IResponseData> => {
  const result = await taskRepo.create(data);
  
  return {
    message: TaskSuccessMessages.CREATED,
    data: result,
  };
};

export const findAllTasks = async (
  inputData: Partial<ITask> & ListOptions
): Promise<IResponseData> => {
  const { data, options } = ListOptions.prepare(inputData);

  const result = await taskRepo.findAll(data, options);
  const count = await taskRepo.countAll(data, options);

  return {
    message: TaskSuccessMessages.LISTED,
    data: result,
    metadata: { totalCount: count },
  };
};

export const findOneTask = async (
  data: Partial<ITask>
): Promise<IResponseData> => {
  const result = await taskRepo.findOne(data);

  if (!result) {
    return {
      statusCode: httpStatus.NOT_FOUND,
      message: TaskErrorMessages.NOT_FOUND,
    };
  }

  return {
    message: TaskSuccessMessages.FOUND,
    data: result,
  };
};

export const updateOneTask = async (
  data: Partial<ITask>
): Promise<IResponseData> => {
  const TaskExists = await taskRepo.findOne(_.pick(data, ["_id"]));

  if (!TaskExists) {
    return {
      statusCode: httpStatus.NOT_FOUND,
      message: TaskErrorMessages.NOT_FOUND,
    };
  }

  if (TaskExists.status != Task_Statuses_Enum.TODO) {
    return {
      statusCode: httpStatus.FORBIDDEN,
      message: "این تسک قابل ویرایش نیست",
    };
  }

  const result = (await taskRepo.findOneAndUpdate(
    _.pick(data, ["_id"]),
    _.omit(data, ["_id"])
  )) as ITask;

  return {
    message: TaskSuccessMessages.UPDATED,
    data: result,
  };
};

// export const deleteOneTask = async (
//   data: Partial<ITask>
// ): Promise<IResponseData> => {
//   const TaskExists = await taskRepo.findOne(_.pick(data, ["_id"]));

//   if (!TaskExists) {
//     return {
//       statusCode: httpStatus.NOT_FOUND,
//       message: TaskErrorMessages.NOT_FOUND,
//     };
//   }

//   if (TaskExists.name === SUPER_ADMIN_Task) {
//     return {
//       statusCode: httpStatus.FORBIDDEN,
//       message: TaskErrorMessages.FORBIDDEN_DELETE_SUPER_ADMIN_Task,
//     };
//   }

//   const result = (await taskRepo.findOneAndSoftDelete(
//     _.pick(data, ["_id"])
//   )) as ITask;

//   return {
//     message: TaskSuccessMessages.DELETED,
//     data: result,
//   };
// };

// export const hardDeleteOneTask = async (
//   data: IParamIdDto
// ): Promise<IResponseData> => {
//   const TaskExists = await taskRepo.findOneAndHardDelete(data);

//   if (!TaskExists) {
//     return {
//       statusCode: httpStatus.NOT_FOUND,
//       message: TaskErrorMessages.NOT_FOUND,
//     };
//   }

//   return {};
// };
