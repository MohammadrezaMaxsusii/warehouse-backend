import { Request } from "express";
import { RequestWithPayload } from "../../interfaces/request-with-payload.interface";
import { configurations } from "../../../config/configurations";
import { verify } from "jsonwebtoken";
import { IPayload } from "../../../auth/interfaces/jwt-payload.interface";
import { IJwtAuthResponse } from "../../dtos/responses/jwt-authorizationfunction.dto";

export const jwtAuthorization = (req: RequestWithPayload): IJwtAuthResponse => {
  const authorizationHeader = req.headers?.authorization;

  const secret: string = configurations.jwt.secret;

  const token = authorizationHeader?.split("Bearer ")[1];

  try {
    const payload: IPayload = verify(token as string, secret) as IPayload;

    return {
      payload,
    };
  } catch (error) {
    return {
      error: true,
    };
  }
};
