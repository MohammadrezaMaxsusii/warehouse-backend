import { body } from "express-validator";
import { Product_Types_Enum } from "../enums/product-types.enum";

export interface ICreateProductDto {
  type: Product_Types_Enum;
  brand?: string;
  partNumber?: string;
  description?: string;
  serialNumber?: string;
  project: string;
  parentPruductId?: string;
}
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

  body("project").isMongoId().withMessage("کد پروژه محصول را وارد کنید"),
  body("parentPruductId")
    .optional()
    .isMongoId()
    .withMessage("شناسه محصول بالادست معتبر نیست"),
];
