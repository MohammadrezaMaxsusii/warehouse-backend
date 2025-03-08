import { IWorkflowStep } from "../workflow.interface";

export const getLastWorkflowStepNumber = (steps: IWorkflowStep[]) => {
  return steps.reduce((max, step) => Math.max(max, step.order), 0);
};
