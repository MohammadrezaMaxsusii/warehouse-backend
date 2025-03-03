import { model, Schema, Types } from "mongoose";
import { baseSchema } from "../../shared";
import { ILogger } from "../interfaces/logger.interface";

const loggerSchema: Schema = new Schema<ILogger>(
  {
    api: {
      type: String,
      required: true,
    },
    entity: {
      type: String,
      required: true,
    },
    method: {
      type: String,
      required: true,
    },
    reqData: {
      type: Object,
      required: false,
    },
    status: {
      type: Number,
      required: true,
    },
    resData: {
      type: Object,
      required: false,
    },
    duration: {
      type: Number,
      required: false,
    },
    error: {
      type: String,
      required: false,
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

loggerSchema.plugin(require("mongoose-autopopulate"));

export const LoggerModel = model<ILogger>("Logger", loggerSchema);
