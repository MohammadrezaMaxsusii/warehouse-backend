import { ProjectRepository } from "./project.repository";
import { IProject } from "./project.interface";
import { IResponseData } from "../shared/interfaces/response-data.interface";
import httpStatus from "http-status";
import { ListOptions } from "../shared/dtos/requests/list-options.dto";
import _ from "lodash";
import { IParamIdDto } from "../shared/dtos/requests/param-id.dto";
import { PermissionRepository } from "../permissions/permission.repository";
import { RepoFactory } from "../shared";
import {
  ProjectErrorMessages,
  ProjectSuccessMessages,
} from "./enums/project-messages.enum";
import { TaskRepository } from "../tasks/tasks.repository";
import { Task_Statuses_Enum } from "../tasks/enums/task-statuses.enum";
import { IPayload } from "../auth/interfaces/jwt-payload.interface";
import { Types } from "mongoose";

const permissionRepo = RepoFactory.getRepo<PermissionRepository>("permission");
const ProjectRepo = RepoFactory.getRepo<ProjectRepository>("project");
const TaskRepo = RepoFactory.getRepo<TaskRepository>("task");
export const createProject = async (
  data: Partial<IProject>,
  payload: IPayload
): Promise<IResponseData> => {
  const duplicateProject = await ProjectRepo.findOne({
    code: data.code,
  });

  if (duplicateProject) {
    return {
      statusCode: httpStatus.CONFLICT,
      message: ProjectErrorMessages.DUPLICATE,
    };
  }

  const result = await ProjectRepo.create({
    ...data,
    unit: new Types.ObjectId(data.unit as any),
  });

  return {
    statusCode: httpStatus.CREATED,
    message: ProjectSuccessMessages.CREATED,
    data: result,
  };
};

export const findAllProjects = async (
  inputData: Partial<IProject> & ListOptions
): Promise<IResponseData> => {
  const { data, options } = ListOptions.prepare(inputData);

  const result = await ProjectRepo.findAll(data, options);

  const count = await ProjectRepo.countAll(data, options);

  return {
    message: ProjectSuccessMessages.LISTED,
    data: result,
    metadata: { totalCount: count },
  };
};

export const findOneProject = async (
  data: Partial<IProject>
): Promise<IResponseData> => {
  const result = await ProjectRepo.findOne(data);

  if (!result) {
    return {
      statusCode: httpStatus.NOT_FOUND,
      message: ProjectErrorMessages.NOT_FOUND,
    };
  }

  return {
    message: ProjectSuccessMessages.FOUND,
    data: result,
  };
};

export const updateOneProject = async (
  data: Partial<IProject>
): Promise<IResponseData> => {
  const ProjectExists = await ProjectRepo.findOne(_.pick(data, ["_id"]));

  if (!ProjectExists) {
    return {
      statusCode: httpStatus.NOT_FOUND,
      message: ProjectErrorMessages.NOT_FOUND,
    };
  }

  const duplicateProject = await ProjectRepo.findOne({ name: data?.name });

  if (
    duplicateProject &&
    ProjectExists._id.toString() !== duplicateProject._id.toString()
  ) {
    return {
      statusCode: httpStatus.CONFLICT,
      message: ProjectErrorMessages.DUPLICATE,
    };
  }

  const result = (await ProjectRepo.findOneAndUpdate(
    _.pick(data, ["_id"]),
    _.omit(data, ["_id"])
  )) as IProject;

  return {
    message: ProjectSuccessMessages.UPDATED,
    data: result,
  };
};

export const deleteOneProject = async (
  data: Partial<IProject>
): Promise<IResponseData> => {
  const ProjectExists = await ProjectRepo.findOne(_.pick(data, ["_id"]));

  if (!ProjectExists) {
    return {
      statusCode: httpStatus.NOT_FOUND,
      message: ProjectErrorMessages.NOT_FOUND,
    };
  }

  const result = (await ProjectRepo.findOneAndSoftDelete(
    _.pick(data, ["_id"])
  )) as IProject;

  return {
    message: ProjectSuccessMessages.DELETED,
    data: result,
  };
};

export const hardDeleteOneProject = async (
  data: IParamIdDto
): Promise<IResponseData> => {
  const ProjectExists = await ProjectRepo.findOneAndHardDelete(data);

  if (!ProjectExists) {
    return {
      statusCode: httpStatus.NOT_FOUND,
      message: ProjectErrorMessages.NOT_FOUND,
    };
  }

  return {};
};
