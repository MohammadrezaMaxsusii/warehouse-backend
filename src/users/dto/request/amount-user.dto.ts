import { body } from "express-validator";
import { Types } from "mongoose";

export interface IChangeUserAmountDto {
  userId: Types.ObjectId;
  value: number;
}

enum Limits {
  MIN = 0,
  MAX = 10 ** 10,
}

enum Messages {
  USER_ID = "شناسه کاربر صحیح نیست",
  VALUE_TYPE = "مقدار وارد شده عدد نیست",
  VALUE_LIMIT_MIN = `اعداد کوچکتر از ${Limits.MIN} معتبر نیست`,
  VALUE_LIMIT_MAX = `اعداد بزرگتر از ${Limits.MAX} معتبر نیست`,
}

export const ChangeUserAmountDto = [
  body("userId").isMongoId().withMessage(Messages.USER_ID),

  body("value")
    .isInt()
    .withMessage(Messages.VALUE_TYPE)
    .custom((value: number) => {
      if (value < Limits.MIN) {
        throw new Error(Messages.VALUE_LIMIT_MIN);
      } else if (value > Limits.MAX) {
        throw new Error(Messages.VALUE_LIMIT_MAX);
      }

      return true;
    }),
];
