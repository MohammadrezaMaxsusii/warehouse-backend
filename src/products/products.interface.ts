import { Types } from "mongoose";
import { IBaseModel } from "../shared";
import { Product_Types_Enum } from "./enums/product-types.enum";
import { IStore } from "../store/store.interface";
import { IProject } from "../projects/project.interface";

export interface IProduct extends IBaseModel {
  project: Types.ObjectId | IProject;
  type: Product_Types_Enum;
  brand?: string;
  partNumber?: string;
  description?: string;
  serialNumber?: string;
  name?: string;
  parentProductId?: Types.ObjectId | IProduct;
}

export interface IProductWithCsv {
  excelId: string;
}
