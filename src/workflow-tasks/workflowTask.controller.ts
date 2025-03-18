import { Router } from "express";
import { Authentication } from "../shared/middlewares/authentication.middleware";
import { Authorization } from "../shared/middlewares/authorization.middleware";
import { DataValidator } from "../shared/middlewares/data-validator.middleware";
import { WorkflowTaskEnginePermissionsEnum } from "./enums/WorkflowTaskPermissionsEnum";
import { CreateWorkflowTaskDto } from "./dto/create.workflowTask.dto";
import { createWorkflowTaskFormData } from "./workflowTask.service";
import { ResponseFormatter } from "../shared";

const router = Router();

// ##################### CREATE (WORKFLOW, STEP, CONDITION) #####################
router.post(
  "/create-formData",
  Authentication,
  Authorization(WorkflowTaskEnginePermissionsEnum.CREATE_FORMDATA),
  CreateWorkflowTaskDto,
  DataValidator,
  ResponseFormatter(createWorkflowTaskFormData)
);

export default router;
