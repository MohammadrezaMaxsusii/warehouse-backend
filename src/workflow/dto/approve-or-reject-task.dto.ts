import { body } from "express-validator";
import { IParamIdDto, ParamIdDto } from "../../shared";

export interface IApproveOrRejectTaskDto extends IParamIdDto {
  textMessage?: string;
}

export const approveOrRejectTaskDto = [
  ...ParamIdDto,
  body("textMessage")
    .optional()
    .isString()
    .withMessage("پیام باید به صورت متن ارسال شود"),
];
