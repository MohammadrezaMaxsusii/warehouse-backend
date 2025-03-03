import { body } from "express-validator";

const validMimetypes = ["image/jpeg", "image/png", "application/pdf","text/csv"];

export interface IUploadFileData {
  name: string;
  data: Buffer;
  size: number;
  mimetype: string;
}
export const uploadFileDto = [
  body("name").isString().withMessage("نام فایل باید رشته باشد"),

  body("data").notEmpty().withMessage("محتوای فایل نمیتواند خالی باشد"),

  body("size").isInt().withMessage("سایز فایل باید عدد باشد"),
  body("mimetype").custom((data) => {
    if (!validMimetypes.includes(data)) {
      throw new Error("فرمت فایل معتبر نیست");
    }

    return true;
  }),
];
