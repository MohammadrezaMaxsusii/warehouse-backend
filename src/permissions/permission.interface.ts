import { Types } from "mongoose";
import { IBaseModel } from "../shared";
import { IRole } from "../roles/role.interface";

export interface IPermission extends IBaseModel {
  name: string;
  roles?: IRole[] | Types.ObjectId[];
}
