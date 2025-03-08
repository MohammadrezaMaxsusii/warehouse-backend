import httpStatus from "http-status";
import { IResponseData, ListOptions, RepoFactory } from "../shared";
import {
  ICreateWorkflowDto,
  ICreateWorkflowStepDto,
  IDefineWorkflowStepConditionsDto,
} from "./dto/create-workflow.dto";
import { WorkflowRepository } from "./workflow.repository";
import { RoleRepository } from "../roles/role.repository";
import { Types } from "mongoose";
import {
  IDeleteWorkflowStepConditionDto,
  IDeleteWorkflowStepDto,
} from "./dto/delete-workflow-step.dto";
import { getLastWorkflowStepNumber } from "./functions/get-last-workflow-step-number.function";
import { Workflow_Step_Type_Enum } from "./enums/workflow-steps-types.enum";
import { IPayload } from "../auth/interfaces/jwt-payload.interface";
import { ICreateStartWorkFlowDto } from "./dto/createStartWorkFlowDto";
import { WorkflowTaskRepository } from "../workflow-tasks/workflowTask.repository";

const workflowRepo = RepoFactory.getRepo<WorkflowRepository>("workflow");
const roleRepo = RepoFactory.getRepo<RoleRepository>("role");
const workflowTaskRepo =
  RepoFactory.getRepo<WorkflowTaskRepository>("workflowTask");
// ##################### CREATE (WORKFLOW, STEP, CONDITION) #####################

export const createWorkflow = async (
  data: ICreateWorkflowDto
): Promise<IResponseData> => {
  const duplicateWorkflow = await workflowRepo.findOne({
    name: data.name,
  });

  if (duplicateWorkflow) {
    return {
      statusCode: httpStatus.BAD_REQUEST,
      message: "فرآیند با این نام قبلاً وجود دارد",
    };
  }

  const allRolesAreValid = await roleRepo.countAll({
    _id: { $in: data.starterRoles },
  });

  if (allRolesAreValid !== data.starterRoles.length) {
    return {
      statusCode: httpStatus.BAD_REQUEST,
      message: "یکی از نقش‌های شروع‌کننده معتبر نیست",
    };
  }

  const result = await workflowRepo.create(data);

  return {
    statusCode: httpStatus.CREATED,
    data: result,
  };
};

export const createWorkflowStep = async (
  data: ICreateWorkflowStepDto
): Promise<IResponseData> => {
  const workflow = await workflowRepo.findOne({ _id: data.workflowId });

  if (!workflow) {
    return {
      statusCode: httpStatus.NOT_FOUND,
      message: "فرآیند یافت نشد",
    };
  }

  // ensure that we have a start step, if not, create one at first
  if (
    workflow.steps.length === 0 &&
    data.type !== Workflow_Step_Type_Enum.START
  ) {
    return {
      statusCode: httpStatus.BAD_REQUEST,
      message: "فرآیند شروع تعریف نشده",
    };
  }

  // check for duplicate start step
  if (
    data.type === Workflow_Step_Type_Enum.START &&
    workflow.steps.some((step) => step.type === Workflow_Step_Type_Enum.START)
  ) {
    return {
      statusCode: httpStatus.BAD_REQUEST,
      message: "فرآیند شروع قبلاً تعریف شده است",
    };
  }

  const lastStepNumber = getLastWorkflowStepNumber(workflow.steps);

  const result = await workflowRepo.createStep(data.workflowId, {
    ...data,
    order: lastStepNumber + 1,
  });

  return {
    statusCode: httpStatus.CREATED,
    data: result,
  };
};

export const createWorkflowStepConditions = async (
  data: IDefineWorkflowStepConditionsDto
): Promise<IResponseData> => {
  const workflow = await workflowRepo.findOne({ _id: data.workflowId });

  if (!workflow) {
    return {
      statusCode: httpStatus.NOT_FOUND,
      message: "فرآیند یافت نشد",
    };
  }

  const step = workflow.steps.find((step) => step.order === data.stepNumber);

  if (!step) {
    return {
      statusCode: httpStatus.BAD_REQUEST,
      message: "شماره مرحله معتبر نیست",
    };
  }

  // check if the step number of every condition is valid and available in db
  const allCurrentStepNumbers = workflow.steps.map((step) => step.order);
  if (
    data.next.conditions &&
    data.next.conditions.some(
      (condition) => !allCurrentStepNumbers.includes(condition.forStepNumber)
    )
  ) {
    return {
      statusCode: httpStatus.BAD_REQUEST,
      message: "شماره مرحله شرط معتبر نیست",
    };
  }

  // check if roles are valid
  const allRolesAreValid = await roleRepo.findAll({
    _id: {
      $in: data.next.conditions.map(
        (condition) => new Types.ObjectId(condition.forRole as any)
      ),
    },
  });

  if (allRolesAreValid.length !== data.next.conditions.length) {
    return {
      statusCode: httpStatus.BAD_REQUEST,
      message: "یکی از نقش‌های شرط معتبر نیست",
    };
  }

  // define step conditions
  const result = await workflowRepo.defineStepConditions(
    data.workflowId,
    data.stepNumber,
    data.next.conditions,
    data.next.logicalOperator
  );

  return {
    statusCode: httpStatus.CREATED,
    data: result,
  };
};

// ##################### DELETE (WORKFLOW, STEP, CONDITION) #####################
export const softDeleteWorkflow = async (
  workflowId: Types.ObjectId
): Promise<IResponseData> => {
  const result = await workflowRepo.findOneAndSoftDelete(workflowId);

  if (!result) {
    return {
      statusCode: httpStatus.NOT_FOUND,
      message: "فرآیند یافت نشد",
    };
  }

  return {
    statusCode: httpStatus.OK,
    data: result,
  };
};

export const deleteWorkflowStep = async (
  data: IDeleteWorkflowStepDto
): Promise<IResponseData> => {
  const workflow = await workflowRepo.findOne({ _id: data.workflowId });
  if (!workflow) {
    return {
      statusCode: httpStatus.NOT_FOUND,
      message: "فرآیند یافت نشد",
    };
  }

  const anyOtherStepHasThisCondition = workflow.steps.some((step) =>
    step.next.conditions.some(
      (condition) => condition.forStepNumber === data.stepNumber
    )
  );

  if (anyOtherStepHasThisCondition) {
    return {
      statusCode: httpStatus.BAD_REQUEST,
      message: "شرطی با این شماره مرحله وجود دارد",
    };
  }

  const result = await workflowRepo.deleteStep(
    data.workflowId,
    data.stepNumber
  );

  return {
    statusCode: httpStatus.OK,
    data: result,
  };
};

export const createStartWorkFlow = async (
  data: ICreateStartWorkFlowDto
): Promise<IResponseData> => {
  const workflow = await workflowRepo.findOne({ _id: data.workflowId });
  if (!workflow) {
    return {
      statusCode: httpStatus.NOT_FOUND,
      message: "فرآیند یافت نشد",
    };
  }

  return {};
};

export const deleteWorkflowStepCondition = async (
  data: IDeleteWorkflowStepConditionDto
): Promise<IResponseData> => {
  const workflow = await workflowRepo.findOne({ _id: data.workflowId });
  if (!workflow) {
    return {
      statusCode: httpStatus.NOT_FOUND,
      message: "فرآیند یافت نشد",
    };
  }

  const step = workflow.steps.find((step) => step.order === data.stepNumber);
  if (!step) {
    return {
      statusCode: httpStatus.BAD_REQUEST,
      message: "شماره مرحله معتبر نیست",
    };
  }

  const result = await workflowRepo.deleteStepCondition(data);

  return {
    statusCode: httpStatus.OK,
    data: result,
  };
};

// ##################### OTHERS #####################
export const listOfWorkflows = async (
  inputData: ListOptions,
  payload: IPayload
): Promise<IResponseData> => {
  const { data, options } = ListOptions.prepare(inputData);

  const result = await workflowRepo.findAll(data, options);
  const count = await workflowRepo.countAll(data, options);

  return {
    statusCode: httpStatus.OK,
    data: result,
    metadata: { totalCount: count },
  };
};

export const listOfAvailableWorkflowsForRole = async (
  _: any,
  payload: IPayload
): Promise<IResponseData> => {
  const result = await workflowTaskRepo.findAll({
    forRoleId: payload.roleIds.map((id) => new Types.ObjectId(id)),
  });

  return {
    statusCode: httpStatus.OK,
    data: result,
  };
};

export const listOfDonedTasksForUser = async (
  _: any,
  payload: IPayload
): Promise<IResponseData> => {
  const result = await workflowTaskRepo.findAll({
    doneBy: new Types.ObjectId(payload.userId),
  });

  return {
    statusCode: httpStatus.OK,
    data: result,
  };
};


export const findOneWorkflow = async (
  workflowId: Types.ObjectId
): Promise<IResponseData> => {
  const result = await workflowRepo.findOne(workflowId);

  if (!result) {
    return {
      statusCode: httpStatus.NOT_FOUND,
      message: "فرآیند یافت نشد",
    };
  }

  return {
    statusCode: httpStatus.OK,
    data: result,
  };
};