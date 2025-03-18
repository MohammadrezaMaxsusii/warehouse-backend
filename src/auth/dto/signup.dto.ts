import { body } from "express-validator";

export interface ISignupDto {
  username: string;
  password: string;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
}

export const SignupDto = [
  // TODO ADD REGEX FOR USERNAME
  body("username")
    .trim()
    .isString()
    .withMessage("نام کاربری باید رشته باشد")
    .isAlphanumeric("en-US")
    .withMessage("نام کاربری شامل حروف انگلیسی و اعداد می باشد")
    .isLength({ min: 4, max: 20 })
    .withMessage("حداقل طول نام کاربری ۴ و حداکثر ۲۰ کاراکتر می باشد")
    .toLowerCase(),

  body("password")
    .isString()
    .withMessage("رمز عبور باید رشته باشد")
    .isLength({ min: 8, max: 32 })
    .withMessage("حداقل طول رمز عبور باید ۸ کاراکتر باشد")
    .isStrongPassword({
      minLowercase: 1,
      minUppercase: 1,
      minSymbols: 1,
    })
    .withMessage("رمز عبور باید شامل حروف بزرگ و کوچک انگلیسی و نماد ها باشد"),

  body("fullName")
    .optional()
    .trim()
    .isString()
    .withMessage("نام باید رشته باشد")
    .isLength({ min: 3, max: 32 })
    .withMessage("حداقل طول نام 3 و حداکثر 32 کاراکتر می باشد"),

  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("فرمت ایمیل وارد شده معتبر نمیباشد"),

  body("phoneNumber")
    .optional()
    .trim()
    .isMobilePhone("ir-IR")
    .withMessage("فرمت شماره موبایل وارد شده معتبر نمیباشد"),
];
