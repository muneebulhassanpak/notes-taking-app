import { JwtPayload } from "jsonwebtoken";
import { Request } from "express";

export interface responseType {
  success: boolean;
  message: string;
  status: number;
  data: any;
}

export interface MyJwtPayload extends JwtPayload {
  userId: string;
  name: string;
  isVerified: boolean;
}

export interface CustomizedRequest extends Request {
  user?: MyJwtPayload;
}
