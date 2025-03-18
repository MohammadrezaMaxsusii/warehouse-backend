import { Router } from "express";
import { ResponseFormatter } from "../shared/middlewares/response-formatter.middelware";
import { loginWithUsernameAndPassword, signup } from "./auth.service";
import { LoginWithUsernameAndPasswordDto } from "./dto/login-with-password.dto";
import { DataValidator } from "../shared/middlewares/data-validator.middleware";
import { SignupDto } from "./dto/signup.dto";

const router = Router();

// End point for new user registration
router.post("/signup", SignupDto, DataValidator, ResponseFormatter(signup));

// End point for login user
router.post(
  "/login",
  LoginWithUsernameAndPasswordDto,
  DataValidator,
  ResponseFormatter(loginWithUsernameAndPassword)
);

export default router;
