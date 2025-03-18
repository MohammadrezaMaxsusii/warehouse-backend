import { IPermission } from "./permission.interface";
import mongoose, { model, Schema, Types } from "mongoose";
import { baseSchema } from "../shared";

const permissionSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: "Role",
        autopopulate: true,
      },
    ],
    ...baseSchema,
  },
  {
    versionKey: false,
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
permissionSchema.plugin(require("mongoose-autopopulate"));
export const PermissionModel = model<IPermission>(
  "Permission",
  permissionSchema
);
