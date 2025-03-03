import { IUnit } from "./unit.interface";
import { model, Schema } from "mongoose";
import { baseSchema } from "../shared";

const unitSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    ...baseSchema,
  },
  {
    versionKey: false,
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const UnitModel = model<IUnit>("Unit", unitSchema);
