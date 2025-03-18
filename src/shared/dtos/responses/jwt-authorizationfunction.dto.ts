import { IPayload } from "../../../auth/interfaces/jwt-payload.interface";

export interface IJwtAuthResponse {
  payload?: IPayload;
  error?: boolean;
}
