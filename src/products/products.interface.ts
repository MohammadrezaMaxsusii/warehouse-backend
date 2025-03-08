import { Types } from "mongoose";
import { IBaseModel } from "../shared";
import { Product_Types_Enum } from "./enums/product-types.enum";
import { IStore } from "../store/store.interface";

export interface IProduct extends IBaseModel {
  code: string;
  type: Product_Types_Enum;
  brand?: string;
  partNumber?: string;
  description?: string;
  serialNumber?: string;
  name ?: string;
}
