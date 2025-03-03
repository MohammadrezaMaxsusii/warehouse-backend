import { model, Schema } from "mongoose";
import { baseSchema } from "../shared";
import { ITask } from "./tasks.interface";
import { Task_Statuses_Enum } from "./enums/task-statuses.enum";

const taskSchema: Schema = new Schema(
  {
    ...baseSchema,
    description: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      enum: Task_Statuses_Enum,
      required: false,
      default: Task_Statuses_Enum.TODO,
    },
    assigneeRole: {
      type: Schema.Types.ObjectId,
      required: false,
      autopopulate: { maxDepth: 1 },
      ref: "Role",
    },
    assignerRole: {
      type: Schema.Types.ObjectId,
      required: false,
      autopopulate: { maxDepth: 1 },
      ref: "Role",
    },
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
        autopopulate: { maxDepth: 1 },
        require: true,
      },
    ],
    store: {
      type: Schema.Types.ObjectId,
      required: false,
      autopopulate: { maxDepth: 1 },
      ref: "Store",
    },
    project: {
      type: Schema.Types.ObjectId,
      required: false,
      ref: "Project",
      autopopulate: { maxDepth: 1 },
    },
    taskFlowDesc: {
      type: String,
      required: false,
      autopopulate: { maxDepth: 1 },
      ref: "Project",
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: false,
      autopopulate: { maxDepth: 1 },
      ref: "Project",
    },
  },

  {
    versionKey: false,
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const TaskModel = model<ITask>("Task", taskSchema);
