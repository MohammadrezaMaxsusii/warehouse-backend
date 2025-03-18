import { model, Schema } from "mongoose";
import { baseSchema } from "../shared";
import { IForms } from "./forms.interface";
import { method } from "lodash";
import { url } from "inspector";

const formsFieldsSchema: Schema = new Schema(
  {
    name:{
      type:String,
      required:true
    },
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
    relatedInstance: {
      
      type: [String],
      required: false,

    },
    relatedInstanceApi:{
        method: {
          type: String,
  
          enum: ["get"],
        },

        url: {
          type: String,
  
        },
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
      required: false,
    },
    refrence:{
      type: String,
      required: true
    },
    type: {
      type: String,
      required: false,
    },
    fields: [{ type: formsFieldsSchema, required: true, default: [] }],
    api: {
      method: {
        type: String,

        enum: ["post", "patch"],
      },
      url: {
        type: String,

      },
   
    },
    tempCsvId: {
      type: String,
      required: false
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

export const FormModel = model<IForms>("Form", formsSchema);
