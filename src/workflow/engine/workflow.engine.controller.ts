import { Router } from "express";
import { Authentication } from "../../shared/middlewares/authentication.middleware";
import { Authorization } from "../../shared/middlewares/authorization.middleware";
import { DataValidator } from "../../shared/middlewares/data-validator.middleware";
import { WorkflowPermissionsEnum } from "../enums/workflow.permissions.enum";
import { ResponseFormatter } from "../../shared/middlewares/response-formatter.middelware";
import {
  CreateWorkflowDto,
  CreateWorkflowStepDto,
  DefineWorkflowStepConditionsDto,
} from "../dto/create-workflow.dto";
import {
  createWorkflow,
  createWorkflowStep,
  deleteWorkflowStep,
  createWorkflowStepConditions,
  softDeleteWorkflow,
  deleteWorkflowStepCondition,
  listOfAvailableWorkflowsForRole,
  listOfDonedTasksForUser,
} from "../workflow.service";
import { ParamIdDto } from "../../shared";
import {
  DeleteWorkflowStepConditionDto,
  DeleteWorkflowStepDto,
} from "../dto/delete-workflow-step.dto";
import { WorkflowEnginePermissionsEnum } from "../enums/workflow.engine.permissions.enum";
import {
  doneAndApproveWorkflowTask,
  doneAndRejectWorkflowTask,
  startWorkflow,
} from "./workflow.enigne.service";

const router = Router();

// ##################### CREATE (WORKFLOW, STEP, CONDITION) #####################
router.post(
  "/start-workflow/:id",
  Authentication,
  Authorization(WorkflowEnginePermissionsEnum.START_WORKFLOW),
  ParamIdDto,
  DataValidator,
  ResponseFormatter(startWorkflow)
);

router.post(
  "/approve-task/:id",
  Authentication,
  Authorization(WorkflowEnginePermissionsEnum.DONE_TASK),
  ParamIdDto,
  DataValidator,
  ResponseFormatter(doneAndApproveWorkflowTask)
);

router.post(
  "/reject-task/:id",
  Authentication,
  Authorization(WorkflowEnginePermissionsEnum.DONE_TASK),
  ParamIdDto,
  DataValidator,
  ResponseFormatter(doneAndRejectWorkflowTask)
);


router.post(
  "/list-of-available-task",
  Authentication,
  Authorization(WorkflowEnginePermissionsEnum.LIST_OF_AVAILABLE_WORKFLOWS),
  DataValidator,
  ResponseFormatter(listOfAvailableWorkflowsForRole)
)


router.post(
  "/list-of-user-doned-tasks",
  Authentication,
  Authorization(WorkflowEnginePermissionsEnum.LIST_OF_AVAILABLE_WORKFLOWS),
  DataValidator,
  ResponseFormatter(listOfDonedTasksForUser)
)
export default router;
