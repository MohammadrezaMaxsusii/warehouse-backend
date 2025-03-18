import { Router } from "express";
import {
  Authentication,
  Authorization,
  DataValidator,
  ResponseFormatter,
} from "../shared";
import { getUserTask ,taskDoneWithCreate, userDonedTasksList, userTasksList } from "./taskManagement.service";
import { CreateTaskDto } from "../tasks/dto/create-task.dto";
import { taskManagementListDto } from "./dto/taskMnagementDto";
import { taskDoneDto } from "./dto/taskDone.dto";

const router = Router();

// Create new task
router.get(
  "/todo",
  Authentication,
  taskManagementListDto,
  DataValidator,
  ResponseFormatter(getUserTask)
);
router.post(
  "/done",
  Authentication,
  taskDoneDto,
  DataValidator,
  ResponseFormatter(taskDoneWithCreate)
);
router.get(
  "/userTasks",
  Authentication,
  taskManagementListDto,
  DataValidator,
  ResponseFormatter(userTasksList)

)
router.get(
  "/userDonedTasks",
  Authentication,
  taskManagementListDto,
  DataValidator,
  ResponseFormatter(userDonedTasksList)

)
export default router;
