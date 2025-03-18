import { Types } from "mongoose";
import { IBaseModel } from "../shared";
import { Workflow_Step_Type_Enum } from "../workflow/enums/workflow-steps-types.enum";
import { IUser } from "../users";
import { Workflow_Task_Status_Enum } from "./enums/workflow.status.enum";
import { IForms } from "../forms/forms.interface";

export interface IWorkflowTask extends IBaseModel {
  perviousTask?: IWorkflowTask | Types.ObjectId;
  textMessage?: string;
  workflowId: Types.ObjectId;
  forRoleId: Types.ObjectId;
  stepName?: string;
  stepDescription?: string;
  stepNumber: number;
  stepType: Workflow_Step_Type_Enum;
  status: Workflow_Task_Status_Enum;
  doneAt?: Date;
  doneBy?: Types.ObjectId | IUser;
  relatedForm?: {
    id: Types.ObjectId;
    fields: {
      id: Types.ObjectId;
      required: boolean;
    }
  }
  formData: any;
}
