import { Types } from "mongoose";
import { RepoFactory } from "../../shared";
import { ITask } from "../../tasks/tasks.interface";
import { TaskRepository } from "../../tasks/tasks.repository";
import { Task_Statuses_Enum } from "../../tasks/enums/task-statuses.enum";

const taskRepo = RepoFactory.getRepo<TaskRepository>("task");

export const changeTaskStatus = async (
  taskId: Types.ObjectId,
  status: Task_Statuses_Enum,
  userId:Types.ObjectId
): Promise<boolean> => {
  return !!(await taskRepo.findOneAndUpdate(
    {
      _id: taskId,
    },
    {
      status,
      userId
    }
  ));
};
