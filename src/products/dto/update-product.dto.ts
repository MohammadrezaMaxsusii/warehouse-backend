import { body } from "express-validator";
import { ParamIdDto } from "../../shared/dtos/requests/param-id.dto";
import { Product_Types_Enum } from "../enums/product-types.enum";

export const UpdateProductDto = [
  ...ParamIdDto,

  body("type")
    .optional()
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
  body("parentPruductId").optional().isMongoId().withMessage("نوع شناسه محصول والد را وارد کنید"),
];
