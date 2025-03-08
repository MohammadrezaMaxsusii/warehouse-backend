import { model, Schema } from "mongoose";
import { baseSchema } from "../shared";
import { EntityList } from "./enums/entity.list.enum";
import { IEntity } from "./entity.interface";

const EntityFieldsSchema: Schema = new Schema(
  {

    name: {
      type: String,
      required: true,
    },
    tableName: [{
      type:String,
      enum: Object.values(EntityList),
      required: true,
    }],

    fields :[{
      type: String,
      required: true

    }],
    ...baseSchema,
  },
  {
    versionKey: false,
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const FormModel = model<IEntity>("Form", EntityFieldsSchema);
