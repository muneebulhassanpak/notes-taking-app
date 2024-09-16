import bcrypt from "bcrypt";
import mongoose from "mongoose";
import User from "../models/User";
import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";

import EmailService from "../utils/email.service";
import { responseType } from "../types/generic.types";
import { withTransaction } from "../utils/generic.service";

// Email generation
const generateVerificationEmailContent = (
  userId: string,
  verificationHash: string
) => {
  const subject = "Zuhu - Please Verify Your Email Address";
  const verificationLink = `${process.env.SITE_DOMAIN}/api/auth/verify?id=${userId}&token=${verificationHash}`;
  const description = `
    <p>Thank you for signing up at Zuhu! Please verify your email address by clicking the link below:</p>
    <a href="${verificationLink}">Verify your email</a>
    <p>If you did not create an account, please ignore this email.</p>
  `;
  return { subject, description };
};

// verification hash generation
const generateVerificationHash = async (email: string) =>
  bcrypt.hash(email, 10);

// Signup function
export const signup = async (
  name: string,
  email: string,
  password: string
): Promise<responseType> => {
  return withTransaction(async (session) => {
    const existingUser = await User.findOne({ email }).session(session);
    if (existingUser) {
      throw new Error("User with the same email already exists.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationHash = await generateVerificationHash(email);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      verificationHash,
    });

    await user.save({ session });

    const { subject, description } = generateVerificationEmailContent(
      user._id.toString(),
      verificationHash
    );
    const emailService = new EmailService();
    await emailService.sendEmail(email, subject, "", description);

    return {
      success: true,
      message:
        "Successfully signed up. Please check your email to verify your account.",
      status: 200,
      data: user._id,
    };
  }).catch((error) => ({
    success: false,
    message: error.message || "An error occurred during signup.",
    status: 500,
    data: null,
  }));
};

// Verify account
export const verifyAccount = async (
  userId: string,
  token: string
): Promise<responseType> => {
  return withTransaction(async (session) => {
    const user = await User.findById(userId).session(session);
    if (!user) throw new Error("No user exists");

    if (user.verificationHash !== token) {
      throw new Error("Invalid authorization link");
    }

    await User.findByIdAndUpdate(userId, { isVerified: true }, { session });

    return {
      success: true,
      message: "Account successfully verified",
      status: 200,
      data: null,
    };
  }).catch((error) => ({
    success: false,
    message: error.message || "An error occurred during account verification.",
    status: 500,
    data: null,
  }));
};

// Signin function
export const signin = async (
  email: string,
  password: string
): Promise<responseType> => {
  return withTransaction(async (session) => {
    const user = await User.findOne({ email }).session(session);
    if (!user) throw new Error("No user found");

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) throw new Error("Incorrect login credentials");

    const tokenData = {
      userId: user._id,
      name: user.name,
      isVerified: user.isVerified,
    };

    const token = jwt.sign(tokenData, process.env.JWT_KEY!);

    user.token = token;
    await user.save({ session });

    return {
      success: true,
      message: "Successful signin",
      status: 200,
      data: { ...tokenData, token },
    };
  }).catch((error) => ({
    success: false,
    message: error.message || "An error occurred during signin.",
    status: 500,
    data: null,
  }));
};
