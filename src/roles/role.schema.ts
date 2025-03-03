import { IRole } from "./role.interface";
import { model, Schema } from "mongoose";
import { baseSchema } from "../shared";

const roleSchema: Schema = new Schema(
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

export const RoleModel = model<IRole>("Role", roleSchema);
