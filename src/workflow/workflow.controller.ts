import { Router } from "express";
import { Authentication } from "../shared/middlewares/authentication.middleware";
import { Authorization } from "../shared/middlewares/authorization.middleware";
import { DataValidator } from "../shared/middlewares/data-validator.middleware";
import { WorkflowPermissionsEnum } from "./enums/workflow.permissions.enum";
import { ResponseFormatter } from "../shared/middlewares/response-formatter.middelware";
import {
  CreateWorkflowDto,
  CreateWorkflowStepDto,
  DefineWorkflowStepConditionsDto,
} from "./dto/create-workflow.dto";
import {
  createWorkflow,
  createWorkflowStep,
  deleteWorkflowStep,
  createWorkflowStepConditions,
  softDeleteWorkflow,
  deleteWorkflowStepCondition,
  listOfAvailableWorkflowsForRole,
  listOfWorkflows,
  findOneWorkflow,
} from "./workflow.service";
import { ListOptionsDto, ParamIdDto } from "../shared";
import {
  DeleteWorkflowStepConditionDto,
  DeleteWorkflowStepDto,
} from "./dto/delete-workflow-step.dto";

const router = Router();

// ##################### CREATE (WORKFLOW, STEP, CONDITION) #####################
router.post(
  "/create",
  Authentication,
  Authorization(WorkflowPermissionsEnum.CREATE),
  CreateWorkflowDto,
  DataValidator,
  ResponseFormatter(createWorkflow)
);

router.post(
  "/create-step",
  Authentication,
  Authorization(WorkflowPermissionsEnum.CREATE),
  CreateWorkflowStepDto,
  DataValidator,
  ResponseFormatter(createWorkflowStep)
);

router.post(
  "/create-step-conditions",
  Authentication,
  Authorization(WorkflowPermissionsEnum.CREATE),
  DefineWorkflowStepConditionsDto,
  DataValidator,
  ResponseFormatter(createWorkflowStepConditions)
);

// ##################### DELETE (WORKFLOW, STEP, CONDITION) #####################
router.delete(
  "/delete/:id",
  Authentication,
  Authorization(WorkflowPermissionsEnum.DELETE),
  ParamIdDto,
  DataValidator,
  ResponseFormatter(softDeleteWorkflow)
);

router.delete(
  "/delete-step",
  Authentication,
  Authorization(WorkflowPermissionsEnum.DELETE),
  DeleteWorkflowStepDto,
  DataValidator,
  ResponseFormatter(deleteWorkflowStep)
);

router.delete(
  "/delete-step-condition",
  Authentication,
  Authorization(WorkflowPermissionsEnum.DELETE),
  DeleteWorkflowStepConditionDto,
  DataValidator,
  ResponseFormatter(deleteWorkflowStepCondition)
);

// ##################### OTHERS #####################
// list of available workflows for a role

router.get(
  "/list",
  Authentication,
  Authorization(WorkflowPermissionsEnum.LIST),
  ListOptionsDto,
  DataValidator,
  ResponseFormatter(listOfWorkflows)
);

router.get(
  "/list-of-available-workflows",
  Authentication,
  ResponseFormatter(listOfAvailableWorkflowsForRole)
);
router.get(
  "/byId/:id",
  Authentication,
  Authorization(WorkflowPermissionsEnum.FIND_ONE),
  ParamIdDto,
  DataValidator,
  ResponseFormatter(findOneWorkflow)
)
export default router;
