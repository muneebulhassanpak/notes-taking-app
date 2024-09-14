import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
dotenv.config();
// const { validationResult } from "express-validator";
import { signup, verifyAccount } from "../services/auth.service";

// Sign up
export const signupController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, email, password } = req.body;
  // let errors = validationResult(req);
  try {
    // if (!errors.isEmpty()) {
    //   return next(new Error(errors));
    // }
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
