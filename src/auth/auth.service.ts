import httpStatus from "http-status";
import { IResponseData } from "../shared/interfaces/response-data.interface";
import { UserRepository } from "../users/user.repository";
import { ILoginWithUsernameAndPasswordDto } from "./dto/login-with-password.dto";
import { compare, hash } from "bcrypt";
import { generateJWT } from "./functions/generate-token.function";
import { UserResponseDto } from "../users/dto/response/user-response.dto";
import { RepoFactory } from "../shared";
import { ISignupDto } from "./dto/signup.dto";
import {
  AuthErrorMessages,
  AuthSuccessMessages,
} from "./enums/auth-messages.enum";

const userRepo = RepoFactory.getRepo<UserRepository>("user");

export const signup = async (data: ISignupDto): Promise<IResponseData> => {
  // Check that the username has not been used before
  const duplicateUsername = await userRepo.findOne({ username: data.username });

  // If there is, we will throw an conflict error
  if (duplicateUsername) {
    return {
      statusCode: httpStatus.CONFLICT,
      message: AuthErrorMessages.USERNAME_ALREADY_EXISTS,
    };
  }

  // If the email was sent, we check that the email has not been used before
  if (data.email) {
    const duplicateEmail = await userRepo.findOne({
      email: data.email,
    });

    // If there is, we will throw an conflict error
    if (duplicateEmail) {
      return {
        statusCode: httpStatus.CONFLICT,
        message: AuthErrorMessages.EMAIL_ALREADY_EXISTS,
      };
    }
  }

  // If the phone number was sent, we check that the phone number has not been used before
  if (data.phoneNumber) {
    const duplicatePhoneNumber = await userRepo.findOne({
      phoneNumber: data.phoneNumber,
    });

    // If there is, we will throw an conflict error
    if (duplicatePhoneNumber) {
      return {
        statusCode: httpStatus.CONFLICT,
        message: AuthErrorMessages.PHONE_NUMBER_ALREADY_EXISTS,
      };
    }
  }

  // Hash password
  const hashedPassword = await hash(data.password as string, 10);
  data.password = hashedPassword;

  // Create user in db
  const result = await userRepo.create(data);

  // Return Result
  return {
    statusCode: httpStatus.CREATED,
    message: AuthSuccessMessages.REGISTERED,
    data: new UserResponseDto(result),
  };
};

export const loginWithUsernameAndPassword = async (
  data: ILoginWithUsernameAndPasswordDto
): Promise<IResponseData> => {
  const userExists = await userRepo.findOne({ username: data.username });

  if (!userExists) {
    return {
      statusCode: httpStatus.FORBIDDEN,
      message: "نام کاربری یا رمز عبور اشتباه است",
    };
  }

  const passwordMatched = await compare(
    data.password,
    userExists.password as string
  );

  if (!passwordMatched) {
    return {
      statusCode: httpStatus.FORBIDDEN,
      message: "نام کاربری یا رمز عبور اشتباه است",
    };
  }

  let roleIds: string[];

  if (Array.isArray(userExists.roles)) {
    roleIds = userExists.roles.map((item) => item._id.toString());
  } else {
    roleIds = [];
  }

  const { access, refresh } = generateJWT({
    userId: userExists._id?.toString() as string,
    roleIds,
  });

  return {
    data: {
      ...new UserResponseDto(userExists),
      access,
      refresh,
    },
  };
};
