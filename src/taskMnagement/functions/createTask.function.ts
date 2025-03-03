import { RepoFactory } from "../../shared";
import { ITask } from "../../tasks/tasks.interface";
import { TaskRepository } from "../../tasks/tasks.repository";

const taskRepo = RepoFactory.getRepo<TaskRepository>("task");


export const createTask = async (taskData: ITask): Promise<boolean> => {
  return !!(await taskRepo.create(taskData));
};
