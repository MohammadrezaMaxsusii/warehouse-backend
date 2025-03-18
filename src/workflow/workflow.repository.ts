import { Model, Types } from "mongoose";
import { BaseRepository } from "../shared";
import { IWorkflow, IWorkflowStepCondition } from "./workflow.interface";
import { ICreateWorkflowStepDto } from "./dto/create-workflow.dto";
import { IDeleteWorkflowStepConditionDto } from "./dto/delete-workflow-step.dto";
import { Workflow_logic_Condition_Enum } from "./enums/workflow.steps.condition.enum";

export class WorkflowRepository extends BaseRepository<IWorkflow> {
  constructor(private readonly workflowModel: Model<IWorkflow>) {
    super(workflowModel);
  }

  async createStep(workflowId: Types.ObjectId, data: ICreateWorkflowStepDto) {
    const result = await this.workflowModel.findByIdAndUpdate(
      workflowId,
      { $push: { steps: data } },
      { new: true }
    );

    return result;
  }

  async deleteStep(workflowId: Types.ObjectId, stepNumber: number) {
    const result = await this.workflowModel.findByIdAndUpdate(
      workflowId,
      { $pull: { steps: { order: stepNumber } } },
      { new: true }
    );

    return result;
  }

  async defineStepConditions(
    workflowId: Types.ObjectId,
    stepNumber: number,
    conditions: IWorkflowStepCondition[],
    logicalOperator?: Workflow_logic_Condition_Enum,
  ) {
    await Promise.all(
      conditions.map((thisCondition) => {
        return this.workflowModel.findOneAndUpdate(
          { _id: workflowId, "steps.order": stepNumber },
          { $push: { "steps.$.next.conditions": thisCondition } },
          { new: true }
        );
      })
    );

    if(logicalOperator){
      await this.workflowModel.findOneAndUpdate(
        { _id: workflowId, "steps.order": stepNumber },
        { $set:{ "steps.$.next.logicalOperator": logicalOperator}  },
        { new: true }
      );
    }
  }

  async deleteStepCondition(data: IDeleteWorkflowStepConditionDto) {
    const result = await this.workflowModel.findOneAndUpdate(
      { _id: data.workflowId, "steps.order": data.stepNumber },
      { $pull: {  "steps.$.next.conditions": { _id: data.conditionId } } },
      { new: true }
    );

    return result;
  }
}
