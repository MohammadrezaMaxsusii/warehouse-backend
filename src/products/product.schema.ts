import { model, Schema } from "mongoose";
import { baseSchema } from "../shared";
import { IProduct } from "./products.interface";
import { Product_Types_Enum } from "./enums/product-types.enum";

const ProductSchema: Schema = new Schema(
  {
    type: {
      type: String,
      required: true,
      enum: Product_Types_Enum,
    },
    brand: {
      type: String,
      required: false,
    },
    partNumber: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    serialNumber: {
      type: String,
      required: false,
    },
    name: {
      type: String,
      ref: "Store",
      required: false,
      autopopulate: { maxDepth: 1 },
    },
    code: {
      type: String,
      ref: "Store",
      required: true,
      autopopulate: { maxDepth: 1 },
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

export const ProductModel = model<IProduct>("Product", ProductSchema);
