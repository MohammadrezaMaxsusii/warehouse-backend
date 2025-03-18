import { Types } from "mongoose";
import { IBaseModel } from "../shared";
import { IRole } from "../roles/role.interface";
import { Workflow_field_Condition_Enum, Workflow_logic_Condition_Enum, Workflow_Step_Condition_Enum } from "./enums/workflow.steps.condition.enum";
import { Workflow_Step_Type_Enum } from "./enums/workflow-steps-types.enum";
import { IForms } from "../forms/forms.interface";

export interface IWorkflowStepCondition {
  forField?: string;
  forStatus: Workflow_Step_Condition_Enum;
  comparisonOperator : Workflow_field_Condition_Enum;
  value: string ;
  forRole: Types.ObjectId | IRole;
  forStepNumber: number;
  conditionType?:Workflow_logic_Condition_Enum;
  _id: Types.ObjectId;
}
export interface IWorkflowNextStep {
  
    conditions:IWorkflowStepCondition[];
    logicalOperator?:Workflow_logic_Condition_Enum;
  
}
export interface IWorkflowStep {
  order: number;
  name: string;
  description?: string;
  type: Workflow_Step_Type_Enum;
  next: IWorkflowNextStep;
  relatedForm?: {
    id: Types.ObjectId;
    fields: {
      id: Types.ObjectId;
      required: boolean;
    }
  }
}
export interface IWorkflow extends IBaseModel {
  name: string;
  description?: string;
  starterRoles: Types.ObjectId[] | IRole[];
  steps: IWorkflowStep[];
}
