import { IStore } from "./store.interface";
import { model, Schema } from "mongoose";
import { baseSchema } from "../shared";

const storeSchema: Schema = new Schema(
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

export const StoreModel = model<IStore>("Store", storeSchema);
