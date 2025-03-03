import { Model } from "mongoose";
import { BaseRepository } from "../shared";
import { ITask } from "./tasks.interface";

export class TaskRepository extends BaseRepository<ITask> {
  constructor(private readonly taskModel: Model<ITask>) {
    super(taskModel);
  }
}
