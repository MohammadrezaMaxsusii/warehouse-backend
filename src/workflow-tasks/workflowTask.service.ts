import httpStatus from "http-status";
import { IResponseData, RepoFactory } from "../shared";
import { ICreateWorkflowTaskDto } from "./dto/create.workflowTask.dto";
import { WorkflowTaskRepository } from "./workflowTask.repository";
import { Workflow_Task_Status_Enum } from "./enums/workflow.status.enum";

const workflowTaskRepo =
  RepoFactory.getRepo<WorkflowTaskRepository>("workflowTask");

export const createWorkflowTaskFormData = async (
  data: ICreateWorkflowTaskDto
): Promise<IResponseData> => {

  const task = await workflowTaskRepo.findOneAndUpdate(
    {
      _id: data._id,
      status: Workflow_Task_Status_Enum.TODO,
      formData: null,
    },
    { formData: data.data }
  );

  if (!task) {
    return {
      statusCode: httpStatus.NOT_FOUND,
      message: "وظیفه ای برای ساخت اطلاعات فرم دریافت نشد",
    };
  }

  return {
    statusCode: httpStatus.OK,
  };
};
