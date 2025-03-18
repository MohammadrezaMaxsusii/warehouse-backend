import { model, Schema } from "mongoose";
import {
  IWorkflow,
  IWorkflowStep,
  IWorkflowStepCondition,
} from "./workflow.interface";
import {
  Workflow_field_Condition_Enum,
  Workflow_logic_Condition_Enum,
  Workflow_Step_Condition_Enum,
} from "./enums/workflow.steps.condition.enum";
import { baseSchema } from "../shared";
import { Workflow_Step_Type_Enum } from "./enums/workflow-steps-types.enum";
import { FormFieldTypeEnum } from "../forms/enums/formTypes.enum";
const workflowStepConditionSchema = new Schema<IWorkflowStepCondition>(
  {
    forStatus: {
      type: String,
      enum: Object.values(Workflow_Step_Condition_Enum),
      required: true,
    },
    forRole: {
      type: Schema.Types.ObjectId,
      ref: "Role",
      autopopulate: { maxDepth: 1 },
      required: true,
    },
    forStepNumber: {
      type: Number,
      required: true,
    },
    forField: {
      required: false,
      type: String,
    },
    comparisonOperator: {
      type: String,
      enum: Object.values(Workflow_field_Condition_Enum),
      required: false,
    },
    value: {
      type: String,
      required: false,
    },
    conditionType: {
      type: String,
      enum: Object.values(Workflow_logic_Condition_Enum),
      required: false,
    },
  },
  { _id: true }
);

const workflowStepSchema = new Schema<IWorkflowStep>(
  {
    order: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    type: {
      type: String,
      enum: Object.values(Workflow_Step_Type_Enum),
      required: true,
    },
    relatedForm:{
      id: {
        type: Schema.Types.ObjectId,
        ref: "Form",
        autopopulate: { maxDepth: 1 },
        required: false,
      },
      fields: [{
        id: {
          type: Schema.Types.ObjectId,
          required: false,
        },
        required: {
          type: Boolean,
          required: false,
        },
      }]
    },
    next: {
      conditions: { 
        type: [workflowStepConditionSchema],
        required: true,
        default: [],
      },
      logicalOperator: {
        type: String,
        enum: Object.values(Workflow_logic_Condition_Enum),
        required: false,
      },
      
    },
  },
  { _id: false }
);

const workflowSchema = new Schema<IWorkflow>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    starterRoles: [
      {
        type: Schema.Types.ObjectId,
        ref: "Role",
        autopopulate: { maxDepth: 1 },
        required: true,
      },
    ],
    steps: [{ type: workflowStepSchema, required: false, default: [] }],
    ...baseSchema,
  },
  {
    versionKey: false,
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

workflowSchema.plugin(require("mongoose-autopopulate"));

export const WorkflowModel = model<IWorkflow>("Workflow", workflowSchema);
