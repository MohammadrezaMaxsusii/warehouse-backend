import { query } from "express-validator";
import { ListOptionsDto } from "../../shared/dtos/requests/list-options.dto";
import { Product_Types_Enum } from "../enums/product-types.enum";

export const FindProductsListDto = [
  query("id")
    .optional()
    .isMongoId()
    .withMessage("فرمت آیدی وارد شده صحیح نمیباشد"),

  query("type")
    .optional()
    .isString()
    .isIn(Object.values(Product_Types_Enum))
    .withMessage(
      `نوع محصول را از میان موارد زیر مشخص کنید: ${Object.values(
        Product_Types_Enum
      )}`
    ),

  query("brand").optional().isString().withMessage("برند محصول را مشخص کنید"),

  query("partNumber")
    .optional()
    .isString()
    .withMessage("پارت نامبر محصول را بصورت متن وارد کنید"),

  query("description")
    .optional()
    .isString()
    .withMessage("توضیحات محصول را وارد نمایید"),

  query("serialNumber")
    .optional()
    .isString()
    .withMessage("سریال نامبر محصول را به صورت متن وارد کنید"),

  ...ListOptionsDto,
];
