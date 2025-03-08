import { model, Schema } from "mongoose";
import { baseSchema } from "../shared";
import { IForms } from "./forms.interface";

const formsFieldsSchema: Schema = new Schema(
  {
    label: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    required: {
      type: Boolean,
      required: true,
    },
    options: {
      type: [String],
      required: false,
    },
    defaultValue: {
      type: String,
      required: false,
    },
    key: {
      type: String,
      required: true,
    },

    relatedForms: [
      {
        type: Schema.Types.ObjectId,
        ref: "froms",
        required: false,
        autopopulate: { maxDepth: 1 },
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
const formsSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    fields: [{ type: formsFieldsSchema, required: true, default: [] }],
    ...baseSchema,
  },
  {
    versionKey: false,
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const FormModel = model<IForms>("Form", formsSchema);
