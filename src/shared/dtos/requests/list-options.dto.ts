import { query } from "express-validator";
import _ from "lodash";

export class ListOptions {
  static keys = ["sort", "asc", "limit", "page", "search"];
  static prepare<T extends object>(
    data: T
  ): {
    options: ListOptions;
    data: Omit<T, keyof ListOptions>;
  } {
    // Pick the relevant keys for ListOptions
    const options = _.pick(data, ListOptions.keys) as ListOptions;

    // Omit those keys from the data and keep the remaining fields
    const filteredData = _.omit(data, ListOptions.keys) as Omit<
      T,
      keyof ListOptions
    >;

    return { options, data: filteredData };
  }

  sort?: string;

  asc?: boolean;

  limit?: number;

  page?: number;

  from?: number;

  to?: number;

  search?: string;
}

export const ListOptionsDto = [
  query("sort").optional().isString().trim(),

  query("asc")
    .optional()
    .isBoolean()
    .withMessage("فقط میقادیر true و false مورد قبول می باشد"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("حداقل تعداد رکورد ۱ و حداکثر ۱۰۰ می باشد"),

  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("حداقل صفحه معتبر ۱ می باشد"),

  query("from")
    .optional()
    .isInt({ gt: 0 })
    .withMessage("زمان شروع باید عدد صحیح باشد"),

  query("to")
    .optional()
    .isInt({ gt: 0 })
    .withMessage("زمان پایان باید عدد صحیح باشد"),

  query("search")
    .optional()
    .isString()
    .withMessage("کلید واژه ی جستوجو باید رشته باشد"),
];
