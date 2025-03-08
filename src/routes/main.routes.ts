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

const router = Router();

// Endpoints of authentication
router.use("/auth", authContorller);

// Endpoints of user entity
router.use("/users", userController);

// Endpoints of role entity
router.use("/roles", roleController);

// Endpoints of permission entity
router.use("/permissions", permissionController);

// Endpoints of files
router.use("/files", fileController);

// Endpoints of store
router.use("/store", storeController);

// Endpoints of tasks
router.use("/tasks", taskController);

// Endpoints of projects
router.use("/projects", projectController);

// Endpoints of projects
router.use("/products", ProductController);

// Endpoints of taskManagenement
router.use("/taskManagement", taskManagementController);

// Endpoints of workflow
router.use("/workflows", workflowController);
// Endpoints of unit
router.use("/unit", UnitController);

// Endpoints of forms
router.use("/forms", formController);

// Endpoints of workflow engine
router.use("/workflow-engine", workflowEngineController);

export default router;
