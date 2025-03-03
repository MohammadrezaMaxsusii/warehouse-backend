import { header } from "express-validator";
import { Types } from "mongoose";

export interface IHeaderCidDto {
  cid: Types.UUID;
}

export const HeaderCidDto = [
  header("cid").isUUID().withMessage("فرمت آیدی سیستم (cid) صحیح نمیباشد"),
];
