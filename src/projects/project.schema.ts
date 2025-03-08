import { IProject, IProjectDate } from "./project.interface";
import { model, Schema } from "mongoose";
import { baseSchema } from "../shared";
import { Project_Statuses_Enum } from "./enums/project-statuses.enu";

const ProjectDateSchema: Schema = new Schema<IProjectDate>({
  name: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: false,
  },
});

const ProjectSchema: Schema = new Schema<IProject>(
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
    unit: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Unit",
      autopopulate: true,
    },
    dates: { type: [ProjectDateSchema], required: false, default: [] },
    cellPhone: { type: String, required: false },
    email: { type: String, required: false },
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
