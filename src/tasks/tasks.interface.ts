import { Types } from "mongoose";
import { IBaseModel } from "../shared";
import { Task_Statuses_Enum } from "./enums/task-statuses.enum";
import { IProduct } from "../products/products.interface";
import { IUser } from "../users";
import { IStore } from "../store/store.interface";
import { IProject } from "../projects/project.interface";
import { IRole } from "../roles/role.interface";

export interface ITask extends IBaseModel {
  description?: string;
  status: Task_Statuses_Enum;
  assigneeRole: Types.ObjectId | IRole;
  assignerRole: Types.ObjectId | IRole;
  products: Types.ObjectId[] | IProduct[];
  store: Types.ObjectId | IStore[];
  project: Types.ObjectId | IProject;
  taskFlowDesc: string;
  userId: Types.ObjectId | IUser;
}
