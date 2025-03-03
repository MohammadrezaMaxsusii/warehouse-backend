import { IProject } from "./project.interface";
import { model, Schema } from "mongoose";
import { baseSchema } from "../shared";
import { Project_Statuses_Enum } from "./enums/project-statuses.enu";

const ProjectSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    files: [
      {
        type: Schema.Types.ObjectId,
        required: false,
        ref: "File",
      },
    ],
    status: {
      type: String,
      enum: Project_Statuses_Enum,
      required: false,
      default: Project_Statuses_Enum.ACTIVE,
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

export const ProjectModel = model<IProject>("Project", ProjectSchema);
