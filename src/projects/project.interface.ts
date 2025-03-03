import { Types } from "mongoose";
import { IBaseModel } from "../shared";
import { Project_Statuses_Enum } from "./enums/project-statuses.enu";
import { IFile } from "../files/file.interface";
import { IProduct } from "../products/products.interface";

export interface IProject extends IBaseModel {
  name: string;
  code: string;
  description?: string;
  files: Types.ObjectId[] | IFile[];
  status: Project_Statuses_Enum;
  productsIds : Types.ObjectId[] | IProduct[];
}
