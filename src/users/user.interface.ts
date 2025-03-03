import { Types } from "mongoose";
import { IBaseModel } from "../shared";
import { IRole } from "../roles/role.interface";
import { AmountUnitEnum } from "../shared/enums/amount-unit.enum";

export interface IUser extends IBaseModel {
  username: string;
  email?: string;
  phoneNumber?: string;
  fullName?: string;
  password: string;
  roles?: IRole[] | Types.ObjectId[];
  amount: number;
  amountUnit: AmountUnitEnum;
}
