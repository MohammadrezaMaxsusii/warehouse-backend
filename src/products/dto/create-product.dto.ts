import { body } from "express-validator";
import { Product_Types_Enum } from "../enums/product-types.enum";

export const CreateProductDto = [
  body("type")
    .isString()
    .isIn(Object.values(Product_Types_Enum))
    .withMessage(
      `نوع محصول را از میان موارد زیر مشخص کنید: ${Object.values(
        Product_Types_Enum
      )}`
    ),

  body("brand").optional().isString().withMessage("برند محصول را مشخص کنید"),

  body("partNumber")
    .optional()
    .isString()
    .withMessage("پارت نامبر محصول را بصورت متن وارد کنید"),

  body("description")
    .optional()
    .isString()
    .withMessage("توضیحات محصول را وارد نمایید"),

  body("serialNumber")
    .optional()
    .isString()
    .withMessage("سریال نامبر محصول را به صورت متن وارد کنید"),
    body("code")
    .optional()
    .isString()
    .withMessage("کد پروژه محصول را وارد کنید"),
];
