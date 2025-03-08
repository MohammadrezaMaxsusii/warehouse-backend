import { Types } from "mongoose";
import { IWorkflowTask } from "../../workflow-tasks/workflowTask.interface";
import { Workflow_Step_Type_Enum } from "../enums/workflow-steps-types.enum";
import { RepoFactory } from "../../shared";
import { WorkflowRepository } from "../workflow.repository";
import { Workflow_Task_Status_Enum } from "../../workflow-tasks/enums/workflow.status.enum";
import { WorkflowTaskRepository } from "../../workflow-tasks/workflowTask.repository";
import { Workflow_Step_Condition_Enum } from "../enums/workflow.steps.condition.enum";
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
    doneStatus: Workflow_Task_Status_Enum
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

    const updatedData = await workflowTaskRepo.findOneAndUpdate(
      { _id: workflowTask._id },
      {
        status: doneStatus,
        doneAt: new Date(),
        doneBy: doneBy,
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

        if (
          con.forStatus === Workflow_Step_Condition_Enum.APPROVE &&
          workflowTask.status === Workflow_Task_Status_Enum.DONE_AND_APPROVED
        ) {
          return true;
        }

        if (
          con.forStatus === Workflow_Step_Condition_Enum.REJECT &&
          workflowTask.status === Workflow_Task_Status_Enum.DONE_AND_REJECTED
        ) {
          return true;
        }

        return false;
      });

      if (nextTargets.length) {
        for (let item of nextTargets) {
          const thisStep = workflow.steps.find(
            (step) => step.order === item.forStepNumber
          );
          if (!thisStep) {
            continue;
          }
          await workflowTaskRepo.create({
            workflowId: workflow._id,
            status: Workflow_Task_Status_Enum.TODO,
            stepDescription: thisStep.description,
            stepNumber: thisStep.order,
            stepType: thisStep.type,
            stepName: thisStep.name,
            forRoleId: item.forRole as Types.ObjectId,
          });
        }
      }
    }

    return { result: true, message: "وظایف بعدی ایجاد شد" };
  }
}
