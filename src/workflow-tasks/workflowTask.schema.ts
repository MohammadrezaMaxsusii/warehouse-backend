import { model } from "mongoose";

import { Schema } from "mongoose";
import { IWorkflowTask } from "./workflowTask.interface";
import { baseSchema } from "../shared";
import { IWorkflow } from "../workflow/workflow.interface";
import { Workflow_Step_Type_Enum } from "../workflow/enums/workflow-steps-types.enum";
import { Workflow_Task_Status_Enum } from "./enums/workflow.status.enum";

const relatedFormSchema = new Schema(
  {
    id: {
      type: Schema.Types.ObjectId,
      ref: "Form",
      autopopulate: { maxDepth: 1 },
      required: false,
    },
    fields: [
      {
        id: {
          type: Schema.Types.ObjectId,
          required: false,
        },
        required: {
          type: Boolean,
          required: false,
        },
      },
    ],
  },
  { _id: false }
);
const workflowTaskSchema = new Schema<IWorkflowTask>(
  {
    perviousTask: {
      type: Schema.Types.ObjectId,
      ref: "WorkflowTask",
      autopopulate: { maxDepth: 2 },
      required: false,
    },
    workflowId: {
      type: Schema.Types.ObjectId,
      ref: "Workflow",
      autopopulate: { maxDepth: 1 },
      required: true,
    },
    stepName: {
      type: String,
      required: false,
    },
    stepDescription: {
      type: String,
      required: false,
    },
    stepNumber: {
      type: Number,
      required: true,
    },
    stepType: {
      type: String,
      required: true,
      enum: Workflow_Step_Type_Enum,
    },
    status: {
      type: String,
      required: true,
      enum: Workflow_Task_Status_Enum,
    },
    doneAt: {
      type: Date,
      required: false,
    },
    doneBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      autopopulate: { maxDepth: 1 },
      required: false,
    },
    forRoleId: {
      type: Schema.Types.ObjectId,
      ref: "Role",
      autopopulate: { maxDepth: 1 },
      required: true,
    },
    textMessage: {
      type: String,
      required: false,
    },
    formData: {
      type: Schema.Types.Mixed,
      required: false,
    },
    relatedForm: relatedFormSchema,
    ...baseSchema,
  },
  {
    versionKey: false,
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

workflowTaskSchema.plugin(require("mongoose-autopopulate"));

export const WorkflowTaskModel = model<IWorkflowTask>(
  "WorkflowTask",
  workflowTaskSchema
);
