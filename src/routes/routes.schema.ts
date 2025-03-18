import { model, Schema } from "mongoose";
import { baseSchema } from "../shared";
import { IRoutes } from "./routes.interface";

const routesSchema: Schema = new Schema<IRoutes>(
  {
    path: {
      type: String,
      required: true,
    },
    method: {
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

export const RouterModel = model<IRoutes>("Route", routesSchema);
