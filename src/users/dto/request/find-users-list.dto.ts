import { query } from "express-validator";
import { ListOptionsDto } from "../../../shared/dtos/requests/list-options.dto";

export const FindUsersListDto = [
  query("_id")
    .optional()
    .isMongoId()
    .withMessage("فرمت آیدی وارد شده صحیح نمیباشد"),

  // TODO ADD REGEX FOR USERNAME
  query("username")
    .optional()
    .trim()
    .isString()
    .withMessage("نام کاربری باید رشته باشد")
    .isAlphanumeric("en-US")
    .withMessage("نام کاربری شامل حروف انگلیسی و اعداد می باشد")
    .isLength({ min: 1, max: 20 })
    .withMessage("حداقل طول نام کاربری ۱ و حداکثر ۲۰ کاراکتر می باشد")
    .toLowerCase(),

  query("firstName")
    .optional()
    .trim()
    .isString()
    .withMessage("نام باید رشته باشد")
    .isLength({ min: 3, max: 32 })
    .withMessage("حداقل طول نام 3 و حداکثر 32 کاراکتر می باشد"),

  query("lastName")
    .optional()
    .trim()
    .isString()
    .withMessage("نام خانوادگی باید رشته باشد")
    .isLength({ min: 3, max: 32 })
    .withMessage("حداقل طول نام خانوادگی 3 و حداکثر 32 کاراکتر می باشد"),

  query("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("فرمت ایمیل وارد شده معتبر نمیباشد"),

  ...ListOptionsDto,
];
