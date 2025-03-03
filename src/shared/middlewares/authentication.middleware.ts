import { NextFunction, Response } from "express";
import { configurations } from "../../config/configurations";
import { verify } from "jsonwebtoken";
import { RequestWithPayload } from "../interfaces/request-with-payload.interface";
import { IPayload } from "../../auth/interfaces/jwt-payload.interface";
import httpStatus from "http-status";
import { AuthErrorMessages } from "../../auth/enums/auth-messages.enum";
import { jwtAuthorization } from "../utils/functions/jwt-authorization.function";

export const Authentication = (
  req: RequestWithPayload,
  res: Response,
  next: NextFunction
) => {
  const { payload, error } = jwtAuthorization(req);

  if (error) {
    return res.status(httpStatus.UNAUTHORIZED).json({
      statusCode: httpStatus.UNAUTHORIZED,
      message: AuthErrorMessages.UNAUTHORIZED,
      error: true,
      data: {},
    });
  }

  req.payload = payload;

  next();
};
