import httpStatus from "http-status";
import { IParamIdDto, IResponseData, RepoFactory } from "../../shared";
import { WorkflowRepository } from "../workflow.repository";
import { WorkflowEngine } from "./workflow.engine.class";
import { IPayload } from "../../auth/interfaces/jwt-payload.interface";
import { Types } from "mongoose";
import { WorkflowTaskRepository } from "../../workflow-tasks/workflowTask.repository";
import { Workflow_Task_Status_Enum } from "../../workflow-tasks/enums/workflow.status.enum";
import { preTaskDoneChecks } from "./functions/pre-task-done-checks.function";
import { IApproveOrRejectTaskDto } from "../dto/approve-or-reject-task.dto";

const workflowRepo = RepoFactory.getRepo<WorkflowRepository>("workflow");
const workflowTaskRepo =
  RepoFactory.getRepo<WorkflowTaskRepository>("workflowTask");

const engine = new WorkflowEngine();

export const startWorkflow = async (
  data: IParamIdDto,
  payload: IPayload
): Promise<IResponseData> => {
  const workflow = await workflowRepo.findOne({ _id: data._id });

  if (!workflow) {
    return {
      statusCode: httpStatus.NOT_FOUND,
      message: "فرآیند یافت نشد",
    };
  }

  const startTask = await engine.createInitTask(
    workflow,
    new Types.ObjectId(payload.roleIds[0])
  );

  if (!startTask.result) {
    return {
      statusCode: httpStatus.BAD_REQUEST,
      message: startTask.message,
    };
  }

  return {
    statusCode: httpStatus.CREATED,
    data: startTask.data,
  };
};

export const doneAndApproveWorkflowTask = async (
  inputData: IApproveOrRejectTaskDto,
  payload: IPayload
): Promise<IResponseData> => {
  const { statusCode, message, data } = await preTaskDoneChecks(
    inputData._id,
    payload
  );

  if (statusCode !== httpStatus.OK) {
    return {
      statusCode,
      message,
    };
  }

  const { workflowTask, workflow } = data;

  const doneTask = await engine.doneTask(
    workflowTask,
    new Types.ObjectId(payload.userId),
    Workflow_Task_Status_Enum.DONE_AND_APPROVED,
    inputData.textMessage
  );

  if (!doneTask.result) {
    return {
      statusCode: httpStatus.BAD_REQUEST,
      message: doneTask.message,
    };
  }

  return {
    statusCode: httpStatus.OK,
    message: "وظیفه با موفقیت انجام شد",
    data: {},
  };
};

export const doneAndRejectWorkflowTask = async (
  inputData: IApproveOrRejectTaskDto,
  payload: IPayload
): Promise<IResponseData> => {
  const { statusCode, message, data } = await preTaskDoneChecks(
    inputData._id,
    payload
  );

  if (statusCode !== httpStatus.OK) {
    return {
      statusCode,
      message,
    };
  }

  const { workflowTask, workflow } = data;
  const doneTask = await engine.doneTask(
    workflowTask,
    new Types.ObjectId(payload.userId),
    Workflow_Task_Status_Enum.DONE_AND_REJECTED,
    inputData.textMessage
  );

  if (!doneTask.result) {
    return {
      statusCode: httpStatus.BAD_REQUEST,
      message: doneTask.message,
    };
  }

  return {
    statusCode: httpStatus.OK,
    message: "وظیفه با موفقیت انجام شد",
    data: {},
  };
};
