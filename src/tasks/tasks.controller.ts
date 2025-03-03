import { Router } from "express";
import { ResponseFormatter } from "../shared/middlewares/response-formatter.middelware";

import { ParamIdDto } from "../shared/dtos/requests/param-id.dto";
import { DataValidator } from "../shared/middlewares/data-validator.middleware";
import { Authentication } from "../shared/middlewares/authentication.middleware";
import { Authorization } from "../shared/middlewares/authorization.middleware";
import { taskPermissionsEnum } from "./enums/task-permissions.enum";
import { CreateTaskDto } from "./dto/create-task.dto";
import {
  createTask,
  findAllTasks,
  findOneTask,
  updateOneTask,
} from "./tasks.service";
import { FindTasksListDto } from "./dto/find-tasks-list.dto";
import { UpdateTasksDto } from "./dto/update-tasks.dto";

const router = Router();

// Create new Task
router.post(
  "/create",
  Authentication,
  Authorization(taskPermissionsEnum.CREATE),
  CreateTaskDto,
  DataValidator,
  ResponseFormatter(createTask)
);

// Find Tasks list
router.get(
  "/list",
  Authentication,
  Authorization(taskPermissionsEnum.LIST),
  FindTasksListDto,
  DataValidator,
  ResponseFormatter(findAllTasks)
);

// Find specific Task
router.get(
  "/byId/:id",
  Authentication,
  Authorization(taskPermissionsEnum.FIND_ONE),
  ParamIdDto,
  DataValidator,
  ResponseFormatter(findOneTask)
);

// Update specific Task
router.patch(
  "/update/:id",
  Authentication,
  Authorization(taskPermissionsEnum.UPDATE),
  UpdateTasksDto,
  DataValidator,
  ResponseFormatter(updateOneTask)
);

// // Delete specific Task
// router.delete(
//   "/delete/:id",
//   Authentication,
//   Authorization(taskPermissionsEnum.DELETE),
//   ParamIdDto,
//   DataValidator,
//   ResponseFormatter(deleteOneTask)
// );

// // Hard Delete specific Task
// router.delete(
//   "/delete/hard/:id",
//   Authentication,
//   Authorization(taskPermissionsEnum.HARD_DELETE),
//   ParamIdDto,
//   DataValidator,
//   ResponseFormatter(hardDeleteOneTask)
// );

export default router;
