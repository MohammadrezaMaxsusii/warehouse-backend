import { model, Schema, Types } from "mongoose";
import { baseSchema } from "../shared";
import { IFile } from "./file.interface";

const fileSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: false,
    },
    size: {
      type: Number,
      required: false,
    },
    uploader: {
      type: Types.ObjectId,
      ref: "User",
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

export const FileModel = model<IFile>("File", fileSchema);
