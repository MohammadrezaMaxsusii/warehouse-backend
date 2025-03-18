import { Types } from "mongoose";
import { IPayload } from "../../../auth/interfaces/jwt-payload.interface";
import { IParamIdDto, IResponseData, RepoFactory } from "../../../shared";
import { IWorkflowTask } from "../../../workflow-tasks/workflowTask.interface";
import { WorkflowTaskRepository } from "../../../workflow-tasks/workflowTask.repository";
import { Workflow_Task_Status_Enum } from "../../../workflow-tasks/enums/workflow.status.enum";
import httpStatus from "http-status";
import { WorkflowRepository } from "../../workflow.repository";

const workflowTaskRepo =
  RepoFactory.getRepo<WorkflowTaskRepository>("workflowTask");
const workflowRepo = RepoFactory.getRepo<WorkflowRepository>("workflow");

export const preTaskDoneChecks = async (
  workflowTaskId: IParamIdDto,
  payload: IPayload
): Promise<IResponseData> => {
  const workflowTask = await workflowTaskRepo.findOne({
    _id: workflowTaskId._id,
    forRoleId: { $in: payload.roleIds.map((id) => new Types.ObjectId(id)) },
  });

  if (!workflowTask) {
    return {
      statusCode: httpStatus.NOT_FOUND,
      message: "وظیفه یافت نشد",
    };
  }

  if (workflowTask.status !== Workflow_Task_Status_Enum.TODO) {
    return {
      statusCode: httpStatus.BAD_REQUEST,
      message: "وظیفه قابل انجام نیست",
    };
  }

  const workflow = await workflowRepo.findOne({ _id: workflowTask.workflowId });

  if (!workflow) {
    return {
      statusCode: httpStatus.NOT_FOUND,
      message: "فرآیند یافت نشد",
    };
  }

  return {
    statusCode: httpStatus.OK,
    data: { workflowTask, workflow },
  };
};
