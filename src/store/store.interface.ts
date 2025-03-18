import { Types } from "mongoose";
import { IBaseModel } from "../shared";

export interface IStore extends IBaseModel {
	name: string;
}
