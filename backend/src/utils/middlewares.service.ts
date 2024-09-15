import jwt from "jsonwebtoken";
import { Response, NextFunction } from "express";
import User from "../models/User";
import { MyJwtPayload, CustomizedRequest } from "../types/generic.types";

// Middleware to check if the request has a valid JWT token
export const hasAttachedCookie = (
  req: CustomizedRequest,
  res: Response,
  next: NextFunction
) => {
  let authorizationHeader = req.headers.authorization;

  if (
    !authorizationHeader ||
    !authorizationHeader.startsWith("access_token ")
  ) {
    throw new Error("Not Logged In");
  }

  const accessToken = authorizationHeader.split(" ")[1];

  try {
    const data = jwt.verify(accessToken, process.env.JWT_KEY!) as MyJwtPayload;
    if (!data) {
      throw new Error("Incorrect token");
    }
    req.user = data;
    next();
  } catch (error) {
    next(error);
  }
};

// Middleware to check if the user exists in the database
export const userExists = async (
  req: CustomizedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;
    const foundUser = await User.findById(userId);

    if (!foundUser) {
      throw new Error("User not found");
    }

    next();
  } catch (error) {
    next(error);
  }
};

// Middleware to check if the user is verified
export const isUserVerified = (
  req: CustomizedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user?.isVerified) {
      throw new Error(
        "You are not verified. Please verify your account to proceed."
      );
    }
    next();
  } catch (error) {
    next(error);
  }
};
