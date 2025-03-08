import { Model, Types } from "mongoose";
import { BaseRepository } from "../shared";
import { IForms } from "./forms.interface";
import { ICreateFormsFieldsDto } from "./dto/createForm.dto";


export class FormsRepository extends BaseRepository<IForms> {
  constructor(private readonly formsModel: Model<IForms>) {
    super(formsModel);
  }
  
async createFields(formId: Types.ObjectId, data: ICreateFormsFieldsDto) {
  const result = await this.formsModel.findByIdAndUpdate(
    formId,
    { $push: { fields: data } },
    { new: true }
  );

  return result;
}
}


