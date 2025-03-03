import jwt from "jsonwebtoken";
import { configurations } from "../../config/configurations";
import { IPayload } from '../interfaces/jwt-payload.interface';
import { ITokens } from '../interfaces/jwt-tokens.interface';

export const generateJWT = (data: IPayload): ITokens => {
  const { userId, roleIds } = data;
  const { accessTtl, refreshTtl, secret } = configurations.jwt;

  const accessToken = jwt.sign(
    {
      userId,
      roleIds,
    },
    secret,
    {
      expiresIn: accessTtl,
    }
  );

  const refreshToken = jwt.sign(
    {
      userId,
      roleIds,
    },
    secret,
    {
      expiresIn: refreshTtl,
    }
  );

  return {
    access: accessToken,
    refresh: refreshToken,
  };
};
