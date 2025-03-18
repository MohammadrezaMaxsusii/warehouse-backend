import { Types } from "mongoose";
import { IBaseModel } from "../shared";
import { Project_Statuses_Enum } from "./enums/project-statuses.enu";
import { IFile } from "../files/file.interface";
import { IProduct } from "../products/products.interface";
import { IUnit } from "../unit/unit.interface";

export interface IProjectDate {
  name?: string;
  description?: string;
  startDate: Date;
  endDate?: Date;
}
export interface IProject extends IBaseModel {
  name: string;
  code: string;
  description?: string;
  files: Types.ObjectId[] | IFile[];
  status: Project_Statuses_Enum;
  productsIds: Types.ObjectId[] | IProduct[];
  unit: Types.ObjectId | IUnit;
  dates?: IProjectDate[];
  cellPhone?: string;
  email?: string;
}
