import { Types } from "mongoose";
import { IBaseModel } from "../shared";
import { EntityList } from "./enums/entity.list.enum";
import { IForms } from "../forms/forms.interface";

export interface IEntityFields  {
      name: string,
      type: string,
      required: boolean,

}
export interface IEntity extends IBaseModel {
  name: string;
  relatedModels?: EntityList[];
  fields: IEntityFields[];
  forms?: Types.ObjectId[] | IForms[]
  
}


