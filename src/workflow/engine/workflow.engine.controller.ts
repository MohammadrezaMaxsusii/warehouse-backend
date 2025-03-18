import { Router } from "express";
import { Authentication } from "../../shared/middlewares/authentication.middleware";
import { Authorization } from "../../shared/middlewares/authorization.middleware";
import { DataValidator } from "../../shared/middlewares/data-validator.middleware";
import { ResponseFormatter } from "../../shared/middlewares/response-formatter.middelware";
import {
  listOfDonedTasksForUser,
  listOfAvailableWorkflowTasksForRole,
} from "../workflow.service";
import { ListOptions, ListOptionsDto, ParamIdDto } from "../../shared";
import { WorkflowEnginePermissionsEnum } from "../enums/workflow.engine.permissions.enum";
import {
  doneAndApproveWorkflowTask,
  doneAndRejectWorkflowTask,
  startWorkflow,
} from "./workflow.enigne.service";
import { approveOrRejectTaskDto } from "../dto/approve-or-reject-task.dto";

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
  approveOrRejectTaskDto,
  DataValidator,
  ResponseFormatter(doneAndApproveWorkflowTask)
);

router.post(
  "/reject-task/:id",
  Authentication,
  Authorization(WorkflowEnginePermissionsEnum.DONE_TASK),
  approveOrRejectTaskDto,
  DataValidator,
  ResponseFormatter(doneAndRejectWorkflowTask)
);

router.get(
  "/list-of-available-task",
  Authentication,
  Authorization(WorkflowEnginePermissionsEnum.LIST_OF_AVAILABLE_WORKFLOWS),
  DataValidator,
  ResponseFormatter(listOfAvailableWorkflowTasksForRole)
);

router.get(
  "/list-of-user-doned-tasks",
  Authentication,
  Authorization(WorkflowEnginePermissionsEnum.LIST_OF_DONE_TASKS_BY_USER),
  ResponseFormatter(listOfDonedTasksForUser)
);

export default router;
