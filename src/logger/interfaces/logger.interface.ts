import { IBaseModel } from "../../shared";

export interface ILogger extends IBaseModel {
  api: string;
  entity: string;
  method: string;
  reqData?: any;
  status: number;
  resData?: any;
  duration?: number;
  error?: string;
}
