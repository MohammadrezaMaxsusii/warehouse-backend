import { Types } from "mongoose";
import { IBaseModel } from "../shared";
import { FormFieldTypeEnum } from "./enums/formTypes.enum";
export interface IFormsFields {
  label: string;
  type: FormFieldTypeEnum;
  required: boolean;
  options: string[];
  defaultValue: string;
  key: string;
  relatedForms?: Types.ObjectId[] | IForms[];
}

export interface IForms extends IBaseModel {
  name: string;
  fields: IFormsFields[];
}
