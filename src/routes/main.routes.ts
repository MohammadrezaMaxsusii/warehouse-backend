import { Router } from "express";
import userController from "../users/user.controller";
import roleController from "../roles/role.controller";
import permissionController from "../permissions/permission.controller";
import authContorller from "../auth/auth.controller";
import fileController from "../files/file.controller";
import storeController from "../store/store.controller";
import taskController from "../tasks/tasks.controller";
import projectController from "../projects/project.controller";
import taskManagementController from "../taskMnagement/taskManagement.controller";
import ProductController from "../products/product.controller";
import workflowController from "../workflow/workflow.controller";
import UnitController from "../unit/unit.controller";
import formController from "../forms/forms.controller";
import workflowEngineController from "../workflow/engine/workflow.engine.controller";
import workflowTasksController from "../workflow-tasks/workflowTask.controller";

const router = Router();

// Endpoints of authentication
router.use("/auth", authContorller);

// Endpoints of user entity
router.use("/user", userController);

// Endpoints of role entity
router.use("/role", roleController);

// Endpoints of permission entity
router.use("/permission", permissionController);

// Endpoints of files
router.use("/file", fileController);

// Endpoints of store
router.use("/store", storeController);

// Endpoints of tasks
router.use("/task", taskController);

// Endpoints of projects
router.use("/project", projectController);

// Endpoints of projects
router.use("/product", ProductController);

// Endpoints of taskManagenement
router.use("/taskManagement", taskManagementController);

// Endpoints of workflow
router.use("/workflow", workflowController);
// Endpoints of unit
router.use("/unit", UnitController);

// Endpoints of forms
router.use("/form", formController);

// Endpoints of workflow engine
router.use("/workflow-engine", workflowEngineController);

// Endpoints of workflow tasks
router.use("/workflow-task", workflowTasksController);

export default router;
