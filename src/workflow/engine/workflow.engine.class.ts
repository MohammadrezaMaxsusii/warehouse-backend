import { Types } from "mongoose";
import { IWorkflowTask } from "../../workflow-tasks/workflowTask.interface";
import { Workflow_Step_Type_Enum } from "../enums/workflow-steps-types.enum";
import { RepoFactory } from "../../shared";
import { WorkflowRepository } from "../workflow.repository";
import { Workflow_Task_Status_Enum } from "../../workflow-tasks/enums/workflow.status.enum";
import { WorkflowTaskRepository } from "../../workflow-tasks/workflowTask.repository";
import {
  Workflow_field_Condition_Enum,
  Workflow_Step_Condition_Enum,
} from "../enums/workflow.steps.condition.enum";
import { IWorkflow } from "../workflow.interface";

interface IEngineResponse<T> {
  result: boolean;
  message: string;
  data?: T;
}
const workflowRepo = RepoFactory.getRepo<WorkflowRepository>("workflow");
const workflowTaskRepo =
  RepoFactory.getRepo<WorkflowTaskRepository>("workflowTask");
export class WorkflowEngine {
  async createInitTask(
    workflow: IWorkflow,
    starterRole: Types.ObjectId
  ): Promise<IEngineResponse<IWorkflowTask>> {
    const initStep = workflow.steps.find(
      (step) => step.type === Workflow_Step_Type_Enum.START
    );

    if (!initStep) {
      return { result: false, message: "مرحله شروع پیدا نشد" };
    }

    const initTask = await workflowTaskRepo.create({
      workflowId: workflow._id,
      relatedForm: initStep.relatedForm,
      status: Workflow_Task_Status_Enum.TODO,
      stepDescription: initStep.description,
      stepNumber: initStep.order,
      stepType: initStep.type,
      stepName: initStep.name,
      forRoleId: starterRole,
    });

    return { result: true, message: "وظیفه ایجاد شد", data: initTask };
  }

  async doneTask(
    workflowTask: IWorkflowTask,
    doneBy: Types.ObjectId,
    doneStatus: Workflow_Task_Status_Enum,
    textMessage?: string
  ): Promise<{ result: boolean; message: string }> {
    if (
      ![Workflow_Step_Type_Enum.TODO, Workflow_Step_Type_Enum.START].includes(
        workflowTask.stepType
      )
    ) {
      return { result: false, message: "این مرحله نیاز به اقدام ندارد" };
    }

    if (workflowTask.status != Workflow_Task_Status_Enum.TODO) {
      return { result: false, message: "وضعیت وظیفه نیاز به اقدام ندارد" };
    }
    if (workflowTask.relatedForm && !workflowTask.formData) {
      return { result: false, message: "فرم مربوطه تکمیل نگردیده است" };
    }
    const updatedData = await workflowTaskRepo.findOneAndUpdate(
      { _id: workflowTask._id },
      {
        status: doneStatus,
        doneAt: new Date(),
        doneBy: doneBy,
        textMessage: textMessage,
      }
    );

    if (!updatedData) {
      return { result: false, message: "وظیفه پیدا نشد" };
    }

    await this.createNexts(updatedData);

    return { result: true, message: "وظیفه انجام شد" };
  }
  async createNexts(
    workflowTask: IWorkflowTask
  ): Promise<{ result: boolean; message: string }> {
    const workflow = await workflowRepo.findOne({
      _id: workflowTask.workflowId,
    });

    if (!workflow) {
      return { result: false, message: "فرایند پیدا نشد" };
    }

    const currentTaskStep = workflow.steps.find(
      (step) => step.order === workflowTask.stepNumber
    );

    if (!currentTaskStep) {
      return { result: false, message: "مرحله پیدا نشد" };
    }

    if (currentTaskStep.next.conditions?.length) {
      const nextTargets = currentTaskStep.next.conditions.filter((con) => {
        if (con.forStatus === Workflow_Step_Condition_Enum.ANY) {
          return true;
        }
        //------------------------------------------------------------------------------
        let firstStepFlag = false;

        if (
          con.forStatus === Workflow_Step_Condition_Enum.APPROVE &&
          workflowTask.status === Workflow_Task_Status_Enum.DONE_AND_APPROVED
        ) {
          firstStepFlag = true;
        }

        if (
          con.forStatus === Workflow_Step_Condition_Enum.REJECT &&
          workflowTask.status === Workflow_Task_Status_Enum.DONE_AND_REJECTED
        ) {
          firstStepFlag = true;
        }
        //------------------------------------------------------------------------------
        let secondStepFlag = false;
        if (!con.forField) {
          return firstStepFlag;
        }
        if (!workflowTask.formData) {
          //TODO ROLLBACK
          return false;
        }
        if (!Number.isNaN(con.value)) {
          con.value = Number(con.value) as unknown as string;
        }
        if(!this.fieldValueComparisor(con.value, workflowTask.formData[con.forField], con.comparisonOperator)) {
          return false;
        }

        return true;
      });

      if (nextTargets.length) {
        for (let item of nextTargets) {
          const thisStep = workflow.steps.find(
            (step) => step.order === item.forStepNumber
          );
          if (!thisStep) {
            continue;
          }

          let taskStatus;
          if (thisStep.type === Workflow_Step_Type_Enum.END) {
            taskStatus = Workflow_Task_Status_Enum.END;
          } else if (thisStep.type === Workflow_Step_Type_Enum.NOTIFICATION) {
            taskStatus = Workflow_Task_Status_Enum.NOTIFICATION;
          } else {
            taskStatus = Workflow_Task_Status_Enum.TODO;
          }

          await workflowTaskRepo.create({
            perviousTask: workflowTask._id,
            workflowId: workflow._id,
            status: taskStatus,
            stepDescription: thisStep.description,
            stepNumber: thisStep.order,
            stepType: thisStep.type,
            stepName: thisStep.name,
            forRoleId: item.forRole as Types.ObjectId,
            relatedForm: thisStep.relatedForm,
          });
        }
      }
    }

    return { result: true, message: "وظایف بعدی ایجاد شد" };
  }

  private fieldValueComparisor(
    conditionValue: any,
    formDataValue: any,
    operator: Workflow_field_Condition_Enum
  ): boolean {
 



    // IS_NULL = "is_null",
    // IS_NOT_NULL = "is_not_null",

    if (operator === Workflow_field_Condition_Enum.EQUALS)
      return formDataValue === conditionValue 
    
    if (operator === Workflow_field_Condition_Enum.NOT_EQUALS)
      return formDataValue !== conditionValue 
    
    if(operator === Workflow_field_Condition_Enum.GREATER_THAN)
      return formDataValue > conditionValue
    
    if(operator === Workflow_field_Condition_Enum.LESS_THAN)
      return formDataValue < conditionValue

    if(operator === Workflow_field_Condition_Enum.GREATER_THAN_OR_EQUAL)
      return formDataValue >= conditionValue

    if(operator === Workflow_field_Condition_Enum.LESS_THAN_OR_EQUAL)
      return formDataValue <= conditionValue

    if(operator === Workflow_field_Condition_Enum.IS_NULL)
      return formDataValue === null

    if(operator === Workflow_field_Condition_Enum.IS_NOT_NULL)
      return formDataValue !== null


    return false
  }
}
