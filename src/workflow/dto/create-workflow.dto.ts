import { body } from "express-validator";
import { Workflow_logic_Condition_Enum, Workflow_Step_Condition_Enum } from "../enums/workflow.steps.condition.enum";
import { IWorkflowNextStep, IWorkflowStepCondition } from "../workflow.interface";
import { Types } from "mongoose";
import { Workflow_Step_Type_Enum } from "../enums/workflow-steps-types.enum";
//########################################################
export interface ICreateWorkflowDto {
  name: string;
  description?: string;
  starterRoles: Types.ObjectId[];
}
export const CreateWorkflowDto = [
  body("name").isString().notEmpty().withMessage("نام فرآیند را وارد کنید"),

  body("description")
    .optional()
    .isString()
    .withMessage("توضیحات فرآیند باید متن باشد"),

  body("starterRoles")
    .isArray({ min: 1 })
    .withMessage("حداقل یک نقش شروع‌کننده باید وارد شود"),

  body("starterRoles.*")
    .isMongoId()
    .withMessage("شناسه حداقل یک نقش شروع‌کننده معتبر نیست"),
];

//########################################################

export interface ICreateWorkflowStepDto {
  workflowId: Types.ObjectId;
  order: number;
  name: string;
  description: string;
  type: Workflow_Step_Type_Enum;
  relatedForm ?: {
    id: Types.ObjectId;
    fields: {
      id: Types.ObjectId;
      required: boolean;
    }[]
  }
}

export const CreateWorkflowStepDto = [
  body("workflowId").isMongoId().withMessage("شناسه فرآیند معتبر نیست"),

  body("name").isString().notEmpty().withMessage("نام مرحله را وارد کنید"),

  body("type")
    .isIn(Object.values(Workflow_Step_Type_Enum))
    .withMessage("نوع مرحله معتبر نیست"),

  body("description")
    .optional()
    .isString()
    .withMessage("توضیحات مرحله باید متن باشد"),
  body("relatedForm").optional().isObject().withMessage("ساختار فرم معتبر نمیباشد"),
]

//########################################################

export interface IDefineWorkflowStepConditionsDto {
  workflowId: Types.ObjectId;
  stepNumber: number;
  next: IWorkflowNextStep;
}

export const DefineWorkflowStepConditionsDto = [
  body("workflowId").isMongoId().withMessage("شناسه فرآیند معتبر نیست"),
  body("stepNumber").isInt().withMessage("شماره مرحله معتبر نیست"),

  body("next").isObject().withMessage("ساختار شرط معتبر نمیباشد"),

  body("next.conditions")
    .isArray({ min: 1 })
    .withMessage("لیست شرط ها صحیح وارد نشده است"),

  body("next.conditions.*.forStatus")
    .isIn(Object.values(Workflow_Step_Condition_Enum))
    .withMessage("وضعیت شرط معتبر نیست"),

  body("next.conditions.*.forRole")
    .isMongoId()
    .withMessage("شناسه نقش شرط معتبر نیست"),

  body("next.conditions.*.forStepNumber")
    .isNumeric()
    .withMessage("شماره مرحله شرط را وارد کنید"),
  body("next.conditions.*forField").optional().isString().withMessage("فیلد معتبر نیست"),
  body("next.conditions.*comparisonOperator").optional().isString().withMessage("عملیات منطقی صحیح نمیباشد"),
  body("next.conditions.*value").optional().isString().withMessage("مقدار ورودی شرط معتبر نیست"),
  body("next.conditions.*conditionType").optional().isString().isIn(Object.values(Workflow_logic_Condition_Enum)).withMessage("مقدار منطقی شرط معتبر نمیباشد"),
  body("next.logicalOperator").optional().isString().isIn(Object.values(Workflow_logic_Condition_Enum)).withMessage("مقدار منطقی شرط معتبر نمیباشد"),
];
