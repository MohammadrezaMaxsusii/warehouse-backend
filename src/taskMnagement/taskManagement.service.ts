import { IPayload } from "../auth/interfaces/jwt-payload.interface";
import { IResponseData, ListOptions, RepoFactory } from "../shared";
import { Task_Statuses_Enum } from "../tasks/enums/task-statuses.enum";
import { ITask } from "../tasks/tasks.interface";
import { TaskRepository } from "../tasks/tasks.repository";
import { ITaskDoneDto } from "./dto/taskDone.dto";
import {
  taskManagementErrorMessages,
  taskManagementFlowList,
  taskManagementSuccessMessages,
} from "./enums/taskManagement-messages.enum";
import { Types } from "mongoose";
import { ProjectRole } from "../shared/enums/project.roles.enum";
import { RoleRepository } from "../roles/role.repository";
import { createTask } from "../tasks/tasks.service";
import { changeTaskStatus } from "./functions/changeTaskStatus";
import { IRole } from "../roles/role.interface";
import { ProjectRepository } from "../projects/project.repository";
import { IProject } from "../projects/project.interface";
import { ProductRepository } from "../products/product.repository";
const taskRepo = RepoFactory.getRepo<TaskRepository>("task");
const rolerepo = RepoFactory.getRepo<RoleRepository>("role");
const projectRepo = RepoFactory.getRepo<ProjectRepository>("project");
const productRepo = RepoFactory.getRepo<ProductRepository>("product");
export const getUserTask = async (
  inputData: Partial<ITask> & ListOptions,
  payload: IPayload
): Promise<IResponseData> => {
  const { data, options } = ListOptions.prepare(inputData);
  if (!payload.roleIds.length) {
    return {
      data: [],
      metadata: {
        totalCount: 0,
      },
    };
  }
  const result = await taskRepo.findAll(
    {
      assigneeRole: payload.roleIds[0],
      status: Task_Statuses_Enum.TODO,
    },
    options
  );

  const count = await taskRepo.countAll(
    {
      assigneeRole: payload.roleIds[0],
      status: Task_Statuses_Enum.TODO,
    },
    options
  );

  for (let item of result) {
    if (item.assigneeRole) {
      item.assigneeRole = (await rolerepo.findOne({
        _id: item.assigneeRole as Types.ObjectId,
      })) as IRole;
    }

    if (item.assignerRole) {
      item.assignerRole = (await rolerepo.findOne({
        _id: item.assignerRole as Types.ObjectId,
      })) as IRole;
    }

    if (item.project) {
      item.project = (await projectRepo.findOne({
        _id: item.project as Types.ObjectId,
      })) as IProject;
    }

    if (item.products?.length) {
      item.products = await productRepo.findAll({
        _id: {
          $in: item.products as Types.ObjectId[],
        },
      });
    }
  }
  return {
    message: taskManagementSuccessMessages.LISTED,
    data: result,
    metadata: { totalCount: count },
  };
};

export const taskDoneWithCreate = async (
  inputData: ITaskDoneDto,
  payload: IPayload
): Promise<IResponseData> => {
  console.log(payload);
  const roleInfo = await rolerepo.findOne({
    _id: payload.roleIds,
  });

  const parentTask = await taskRepo.findOne({
    _id: inputData.taskId,
  });

  if (!parentTask) {
    return {
      message: taskManagementErrorMessages.NOT_FOUND,
      data: [],
    };
  }

  if (
    (roleInfo?.name == ProjectRole.Technical_Manager ||
      roleInfo?.name == ProjectRole.Super_Admin) &&
    parentTask.taskFlowDesc == taskManagementFlowList.PRUDUCT_CREATE &&
    inputData.taskCheck == "verify"
  ) {
    const assigneeRoleRoleId = await rolerepo.findOne({
      name: ProjectRole.Foreign_Buyer_Manager,
    });
    if (!assigneeRoleRoleId) {
      return {
        message: taskManagementErrorMessages.NOT_FOUND,
        data: [],
      };
    }

    const taskData = {
      pid: inputData.taskId,
      assigneeRole: assigneeRoleRoleId?._id,
      assignerRole: new Types.ObjectId(payload.roleIds[0]),
      status: Task_Statuses_Enum.TODO,
      project: parentTask.project,
      taskFlowDesc: taskManagementFlowList.VERIFY_PRODUCT,
      description:
        "  محصولات مورد تایید میباشد پس از خرید در اختیار انبار  قرار خواهد گرفت",
    };
    createTask(taskData);
    changeTaskStatus(
      new Types.ObjectId(inputData.taskId),
      Task_Statuses_Enum.DONE,
      new Types.ObjectId(payload.userId)
    );
  }
  if (
    (roleInfo?.name == ProjectRole.Technical_Manager ||
      roleInfo?.name == ProjectRole.Super_Admin) &&
    parentTask.taskFlowDesc == taskManagementFlowList.PRUDUCT_CREATE &&
    inputData.taskCheck == "reject"
  ) {
    const assigneeRoleRoleId = await rolerepo.findOne({
      name: ProjectRole.Foreign_Buyer_Manager,
    });
    const taskData = {
      pid: inputData.taskId,
      assigneeRole: assigneeRoleRoleId?._id,
      assignerRole: new Types.ObjectId(payload.roleIds[0]),
      status: Task_Statuses_Enum.TODO,
      project: parentTask.project,
      taskFlowDesc: taskManagementFlowList.REJECT_PRODUCT,
      description:
        "  محصول مورد تایید تیم فنی نمیباشد پس از بازبینی مجدد در اختیار تیم فنی قرار خواهد گرفت",
    };
    createTask(taskData);
    changeTaskStatus(
      new Types.ObjectId(inputData.taskId),
      Task_Statuses_Enum.DONE,
      new Types.ObjectId(payload.userId)
    );
  }
  if (
    (roleInfo?.name == ProjectRole.Foreign_Buyer_Manager ||
      roleInfo?.name == ProjectRole.Super_Admin) &&
    parentTask.taskFlowDesc == taskManagementFlowList.REJECT_PRODUCT &&
    inputData.taskCheck == "verify"
  ) {
    const assigneeRoleRoleId = await rolerepo.findOne({
      name: ProjectRole.Warehouse_Manager,
    });

    const taskData = {
      pid: inputData.taskId,
      assigneeRole: assigneeRoleRoleId?._id,
      assignerRole: new Types.ObjectId(payload.roleIds[0]),
      status: Task_Statuses_Enum.TODO,
      project: parentTask.project,
      taskFlowDesc: taskManagementFlowList.BUY_PRODUCT,
      description:
        "محصول رد توسط تیم خرید اصلاح گردیده و پس از تایید مجدد در اختیار تیم خرید قرار خواهد گرفت",
    };
    createTask(taskData);
    changeTaskStatus(
      new Types.ObjectId(inputData.taskId),
      Task_Statuses_Enum.DONE,
      new Types.ObjectId(payload.userId)
    );
  }
  if (
    (roleInfo?.name == ProjectRole.Foreign_Buyer_Manager ||
      roleInfo?.name == ProjectRole.Super_Admin) &&
    parentTask.taskFlowDesc == taskManagementFlowList.VERIFY_PRODUCT &&
    inputData.taskCheck == "verify"
  ) {
    const assigneeRoleRoleId = await rolerepo.findOne({
      name: ProjectRole.Warehouse_Manager,
    });
    const taskData = {
      pid: inputData.taskId,
      assigneeRole: assigneeRoleRoleId?._id,
      assignerRole: new Types.ObjectId(payload.roleIds[0]),
      status: Task_Statuses_Enum.TODO,
      project: parentTask.project,
      taskFlowDesc: taskManagementFlowList.BUY_PRODUCT,
      description:
        "محصولات خریداری شده و پس از تایید در اختیار تیم فنی قرار خواهد گرفت",
    };
    createTask(taskData);
    changeTaskStatus(
      new Types.ObjectId(inputData.taskId),
      Task_Statuses_Enum.DONE,
      new Types.ObjectId(payload.userId)
    );
  }
  if (
    (roleInfo?.name == ProjectRole.Warehouse_Manager ||
      roleInfo?.name == ProjectRole.Super_Admin) &&
    parentTask.taskFlowDesc == taskManagementFlowList.BUY_PRODUCT &&
    inputData.taskCheck == "verify"
  ) {
    const assigneeRoleRoleId = await rolerepo.findOne({
      name: ProjectRole.Technical_Manager,
    });
    const taskData = {
      pid: inputData.taskId,
      assigneeRole: assigneeRoleRoleId?._id,
      assignerRole: new Types.ObjectId(payload.roleIds[0]),
      status: Task_Statuses_Enum.TODO,
      project: parentTask.project,
      taskFlowDesc: taskManagementFlowList.BUY_PRODUCT,
      description:
        "محصولات خریداری شده و پس از تایید در اختیار تیم فنی قرار خواهد گرفت",
    };

    createTask(taskData);
    changeTaskStatus(
      new Types.ObjectId(inputData.taskId),
      Task_Statuses_Enum.DONE,
      new Types.ObjectId(payload.userId)
    );
  }
  if (
    (roleInfo?.name == ProjectRole.Foreign_Buyer_Manager ||
      roleInfo?.name == ProjectRole.Super_Admin) &&
    parentTask.taskFlowDesc == taskManagementFlowList.BUY_PRODUCT &&
    inputData.taskCheck == "verify"
  ) {
    const assigneeRoleRoleId = await rolerepo.findOne({
      name: ProjectRole.Technical_Manager,
    });
    const taskData = {
      pid: inputData.taskId,
      assigneeRole: assigneeRoleRoleId?._id,
      assignerRole: new Types.ObjectId(payload.roleIds[0]),
      status: Task_Statuses_Enum.TODO,
      project: parentTask.project,
      taskFlowDesc: taskManagementFlowList.ASSIGN_PRODUCT,
      description: "محصول جهت نصب",
    };
    createTask(taskData);
    changeTaskStatus(
      new Types.ObjectId(inputData.taskId),
      Task_Statuses_Enum.DONE,
      new Types.ObjectId(payload.userId)
    );
  }
  if (
    (roleInfo?.name == ProjectRole.Technical_Manager ||
      roleInfo?.name == ProjectRole.Super_Admin) &&
    parentTask.taskFlowDesc == taskManagementFlowList.ASSIGN_PRODUCT &&
    inputData.taskCheck == "verify"
  ) {
    changeTaskStatus(
      new Types.ObjectId(inputData.taskId),
      Task_Statuses_Enum.DONE,
      new Types.ObjectId(payload.userId)
    );
  }
  return {
    message: taskManagementSuccessMessages.DONE,
    data: [taskRepo],
  };
};

export const userTasksList = async (
  payload: IPayload
): Promise<IResponseData> => {
  const taskListForUser = taskRepo.findAll({
    userId: payload.userId,
  });
  return {
    data: taskListForUser,
  };
};
export const userDonedTasksList = async (
  _: any,
  payload: IPayload
): Promise<IResponseData> => {
  console.log(payload);
  const taskListForUser = await taskRepo.findAll({
    userId: payload.userId,
    status: Task_Statuses_Enum.DONE,
  });

  for (let item of taskListForUser) {
    if (item.assigneeRole) {
      item.assigneeRole = (await rolerepo.findOne({
        _id: item.assigneeRole as Types.ObjectId,
      })) as IRole;
    }

    if (item.assignerRole) {
      item.assignerRole = (await rolerepo.findOne({
        _id: item.assignerRole as Types.ObjectId,
      })) as IRole;
    }

    if (item.project) {
      item.project = (await projectRepo.findOne({
        _id: item.project as Types.ObjectId,
      })) as IProject;
    }

    if (item.products?.length) {
      item.products = await productRepo.findAll({
        _id: {
          $in: item.products as Types.ObjectId[],
        },
      });
    }
  }

  return {
    data: taskListForUser,
  };
};

// export const createProject = async (
//   inputData: Partial<ITask> & ListOptions,
//   payload: IPayload
// ): Promise<IResponseData> =>{
// }
