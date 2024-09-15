import bcrypt from "bcrypt";
import mongoose from "mongoose";
import User from "../models/User";
import dotenv from "dotenv";
dotenv.config();

import EmailService from "../utils/email.service";
import { responseType } from "../types/generic.types";

const generateVerificationHash = async (email: string) => {
  return await bcrypt.hash(email, 10);
};

export const signup = async (
  name: string,
  email: string,
  password: string
): Promise<responseType> => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    // Check if the user already exists
    const existingUser = await User.findOne({ email: email }).session(session);
    if (existingUser) {
      throw new Error("User with the same email already exists.");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification hash
    const verificationHash = await generateVerificationHash(email);

    // Create a new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      verificationHash,
    });
    await user.save({ session });

    // Prepare email content
    const subject = "Zuhu - Please Verify Your Email Address";
    const verificationLink = `${process.env.SITE_DOMAIN}/api/auth/verify?id=${user._id}&token=${verificationHash}`;
    const description = `
    <p>Thank you for signing up at Zuhu! Please verify your email address by clicking the link below:</p>
    <a href="${verificationLink}">Verify your email</a>
    <p>If you did not create an account, please ignore this email.</p>
    `;
    const emailService = new EmailService();
    await emailService.sendEmail(email, subject, "", description);
    await session.commitTransaction();

    return {
      success: true,
      message:
        "Successfully signed up. Please check your email to verify your account.",
      status: 200,
      data: user._id,
    };
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    let errorMessage = "An error occurred during signup.";
    if (error instanceof Error) {
      errorMessage = error.message;
    } else {
      console.error("Unexpected error:", error); // Log the error for debugging
    }

    return {
      success: false,
      message: errorMessage,
      status: 500,
      data: null,
    };
  } finally {
    session.endSession();
  }
};

export const verifyAccount = async (
  userId: string,
  token: string
): Promise<responseType> => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("No user exists");
    }

    const doesHashMatch = user.verificationHash === token;

    if (!doesHashMatch) {
      throw new Error("Invalid authorization link");
    }

    await User.findByIdAndUpdate(
      userId,
      { $set: { isVerified: true } },
      { session }
    );

    await session.commitTransaction();

    return {
      success: true,
      message: "Account successfully verified",
      status: 200,
      data: null,
    };
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    let errorMessage = "An error occurred during account verification.";
    if (error instanceof Error) {
      errorMessage = error.message;
    } else {
      console.error("Unexpected error:", error);
    }

    return {
      success: false,
      message: errorMessage,
      status: 500,
      data: null,
    };
  } finally {
    session.endSession();
  }
};
