import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
dotenv.config();
import { signup, verifyAccount, signin } from "../services/auth.service";
import { CustomizedRequest } from "../types/generic.types";

// Sign up
export const signupController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, email, password } = req.body;
  try {
    const response = await signup(name, email, password);
    return res.json(response);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// Account Verification
export const accountVerificationController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.query.id as string;
  const token = req.query.token as string;

  if (!id || !token) {
    return next(new Error("Invalid or missing query parameters"));
  }

  try {
    const response = await verifyAccount(id, token);
    return res.json(response);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// Sign in
export const signinController = async (
  req: CustomizedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new Error("Invalid/Incomplete Data");
    }
    const response = await signin(email, password);

    res
      .header("Access-Control-Allow-Credentials", "true")
      .cookie("access_token", response?.data);
    const modifiedResponse = { ...response, data: response?.data };
    return res.json(modifiedResponse);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
