import { NextFunction, Response } from "express";
import { RequestWithPayload } from "../interfaces/request-with-payload.interface";
import httpStatus from "http-status";
import { AuthErrorMessages } from "../../auth/enums/auth-messages.enum";
import { jwtAuthorization } from "../utils/functions/jwt-authorization.function";

export const PublicAuthentication = (
  req: RequestWithPayload,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers?.authorization?.split("Bearer ")[1];

  if (!token) {
    return next();
  }

  const { payload, error } = jwtAuthorization(req);

  if (payload && !error) {
    req.payload = payload;
  }

  next();
};
