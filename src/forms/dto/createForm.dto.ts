import { body } from "express-validator";
import { Types } from "mongoose";
import { IFormsFields } from "../forms.interface";

export const CreateFormssDto = [

  body("name")
    .trim()
    .notEmpty()
    .withMessage("نام فرم نمی تواند خالی باشد")
    .isString()
    .withMessage("نام فرم باید رشته باشد")
    .toLowerCase(),
];

export const CreateFormssDtoFields = [
  body("formId").isMongoId().withMessage("شناسه فرم معتبر نیست"),
  body("fields")
    .isArray()
    .withMessage("لیست فیلد ها صحیح وارد نشده است"),
  body("fields.*.label")
    .isString()
    .withMessage("نام فیلد باید رشته باشد"),
  body("fields.*.type")
    .isString().notEmpty()
    .withMessage("نوع فیلد باید رشته باشد"),
  body("fields.*.required")
    .isBoolean().notEmpty()
    .withMessage("وضعیت فیلد صحیح وارد نشده است"),
  body("fields.*.options")
  .isArray().notEmpty()
  .withMessage("لیست اختیارات صحیح وارد نشده است"),
  body("fields.*.options.*")
  .isString().notEmpty()
  .withMessage("لیست اختیارات صحیح وارد نشده است"),
  body("fields.*.defaultValue")
  .isString().notEmpty()
  .withMessage("مقدار پیشفرض صحیح وارد نشده است"),
  body("fields.*.key")
  .isString().notEmpty()
  .withMessage("کلید فیلد صحیح وارد نشده است"),
  body("fields.*.required")
  .isBoolean().notEmpty()
  .withMessage("وضعیت فیلد صحیح وارد نشده است"),
]

export interface ICreateFormsFieldsDto {
  formId: Types.ObjectId;
  fields: IFormsFields[];
}