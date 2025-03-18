import { Types } from "mongoose";

export default interface IBaseModel {
  _id: Types.ObjectId;
  createdAt: number;
  updatedAt: number;
  deletedAt?: number;
  pid?: Types.ObjectId;
}
