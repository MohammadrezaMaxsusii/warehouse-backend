import { Types } from "mongoose";
import { IBaseModel } from "../shared";
import { Workflow_Step_Type_Enum } from "../workflow/enums/workflow-steps-types.enum";
import { IUser } from "../users";
import { Workflow_Task_Status_Enum } from "./enums/workflow.status.enum";

export interface IWorkflowTask extends IBaseModel {
  workflowId: Types.ObjectId;
  forRoleId: Types.ObjectId;
  stepName?: string;
  stepDescription?: string;
  stepNumber: number;
  stepType: Workflow_Step_Type_Enum;
  status: Workflow_Task_Status_Enum;
  doneAt?: Date;
  doneBy?: Types.ObjectId | IUser;
}
