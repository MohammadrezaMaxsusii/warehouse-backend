import { Router } from "express";
import { ResponseFormatter } from "../shared/middlewares/response-formatter.middelware";
import { ParamIdDto } from "../shared/dtos/requests/param-id.dto";
import { DataValidator } from "../shared/middlewares/data-validator.middleware";
import { Authentication } from "../shared/middlewares/authentication.middleware";
import { Authorization } from "../shared/middlewares/authorization.middleware";
import {
  createProject,
  deleteOneProject,
  findAllProjects,
  findOneProject,
  hardDeleteOneProject,
  updateOneProject,
} from "./project.service";
import { ProjectPermissionsEnum } from "./enums/project-permissions.enum";
import { CreateProjectDto } from "./dto/create-project.dto";
import { FindProjectsListDto } from "./dto/find-project-list.dto";
import { UpdateProjectDto } from "./dto/update-project.dto";

const router = Router();

// Create new Project
router.post(
  "/create",
  Authentication,
  Authorization(ProjectPermissionsEnum.CREATE),
  CreateProjectDto,
  DataValidator,
  ResponseFormatter(createProject)
);

// Find Projects list
router.get(
  "/list",
  Authentication,
  Authorization(ProjectPermissionsEnum.LIST),
  FindProjectsListDto,
  DataValidator,
  ResponseFormatter(findAllProjects)
);

// Find specific Project
router.get(
  "/byId/:id",
  Authentication,
  Authorization(ProjectPermissionsEnum.FIND_ONE),
  ParamIdDto,
  DataValidator,
  ResponseFormatter(findOneProject)
);

// Update specific Project
router.patch(
  "/update/:id",
  Authentication,
  Authorization(ProjectPermissionsEnum.UPDATE),
  UpdateProjectDto,
  DataValidator,
  ResponseFormatter(updateOneProject)
);

// Delete specific Project
router.delete(
  "/delete/:id",
  Authentication,
  Authorization(ProjectPermissionsEnum.DELETE),
  ParamIdDto,
  DataValidator,
  ResponseFormatter(deleteOneProject)
);

// Hard Delete specific Project
router.delete(
  "/delete/hard/:id",
  Authentication,
  Authorization(ProjectPermissionsEnum.HARD_DELETE),
  ParamIdDto,
  DataValidator,
  ResponseFormatter(hardDeleteOneProject)
);

export default router;
