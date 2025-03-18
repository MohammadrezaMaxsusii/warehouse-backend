import { Request } from "express";
import { IPayload } from "../../auth/interfaces/jwt-payload.interface";

export interface RequestWithPayload extends Request {
  payload?: IPayload;
}
