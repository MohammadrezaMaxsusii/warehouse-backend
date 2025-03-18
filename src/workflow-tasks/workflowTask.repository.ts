import { Model, Types } from "mongoose";
import { BaseRepository } from "../shared";
import { IWorkflowTask } from "./workflowTask.interface";

export class WorkflowTaskRepository extends BaseRepository<IWorkflowTask> {
  constructor(private readonly workflowTaskModel: Model<IWorkflowTask>) {
    super(workflowTaskModel);
  }
}
