import { Types } from "mongoose";
import { IBaseModel } from "../shared";
import { FormFieldTypeEnum } from "./enums/formTypes.enum";
import { IFile } from "../files/file.interface";
export interface IFormsFields {
  _id: Types.ObjectId;
  name: string;
  label: string;
  type: FormFieldTypeEnum;
  required: boolean;
  options: string[];
  defaultValue: string;
  key: string;
  relatedForms?: Types.ObjectId[] | IForms[];
  relatedInstance?: string;
  relatedInstanceApi?: object;
}

export interface IForms extends IBaseModel {
  name: string;
  refrence: string;
  type: "create" | "update";
  fields: IFormsFields[];
  api: {
    method: "post" | "patch";
    url: string;
  };
  tempCsvId : IFile | string;
}
