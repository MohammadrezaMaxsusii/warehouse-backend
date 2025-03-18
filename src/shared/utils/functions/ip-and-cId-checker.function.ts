import httpStatus from "http-status";
import { Request } from "express";
import { IResponseData } from "../../interfaces";
import { SharedErrorMessages } from "../../enums";

export const ipAndcIdChecker = (req: Request): IResponseData => {
  const ip = req?.ip as string;
  const cId = req?.headers?.cid as string;

  if (!ip) {
    return {
      error: true,
      data: {
        statusCode: httpStatus.BAD_REQUEST,
        message: SharedErrorMessages.IP_DETECTION_ERROR,
      },
    };
  } else if (!cId) {
    return {
      error: true,
      data: {
        statusCode: httpStatus.BAD_REQUEST,
        message: SharedErrorMessages.CLIENT_ID_REQUIRED,
      },
    };
  }

  return { data: { ip, cId } };
};
