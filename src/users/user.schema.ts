import { IUser } from "./user.interface";
import { model, Schema } from "mongoose";
import { baseSchema } from "../shared";
import { AmountUnitEnum } from "../shared/enums/amount-unit.enum";

const userSchema: Schema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: false,
    },
    phoneNumber: {
      type: String,
      required: false,
    },
    roles: [
      {
        type: Schema.Types.ObjectId,
        ref: "Role",
        autopopulate: { maxDepth: 1 },
        require: false,
      },
    ],
    amount: {
      type: Number,
      required: false,
      default: 0,
    },
    amountUnit: {
      type: String,
      required: false,
      enum: AmountUnitEnum,
      default: AmountUnitEnum.TOMAN,
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

userSchema.plugin(require("mongoose-autopopulate"));

export const UserModel = model<IUser>("User", userSchema);
