import { Schema, SchemaType, Types } from "mongoose";
import { IBaseModel } from "../shared";
import { IUser } from "../users/user.interface";

export interface IFile extends IBaseModel {
  name: string;
  type?: string;
  size?: number; // in bytes
  uploader: IUser | Types.ObjectId;
}
