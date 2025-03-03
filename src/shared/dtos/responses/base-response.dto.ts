import { IBaseModel } from "../../base";

export class BaseResponseDto {
  id: string;
  createdAt: number;
  updatedAt: number;
  deletedAt?: number;
  pid?: string;

  constructor(initial: IBaseModel) {
    this.id = initial._id?.toString();
    this.createdAt = initial.createdAt;
    this.updatedAt = initial.updatedAt;
    this.deletedAt = initial?.deletedAt;
    this.pid = initial?.pid?.toString();
  }
}
