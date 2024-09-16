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

export interface fullUser {
  name: string;
  email: string;
  password: string;
  image?: string;
  isVerified?: boolean;
  verificationHash: string;
  token?: string;
  groups?: any[];
}

export interface CustomizedRequest extends Request {
  basicUser?: MyJwtPayload;
  fullUser?: fullUser;
}
