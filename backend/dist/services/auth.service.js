"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAccount = exports.signup = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = __importDefault(require("../models/User"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const email_service_1 = __importDefault(require("../utils/email.service"));
const generateVerificationHash = (email) => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcrypt_1.default.hash(email, 10);
});
const signup = (name, email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        // Check if the user already exists
        const existingUser = yield User_1.default.findOne({ email: email }).session(session);
        if (existingUser) {
            throw new Error("User with the same email already exists.");
        }
        // Hash the password
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        // Generate verification hash
        const verificationHash = yield generateVerificationHash(email);
        // Create a new user
        const user = new User_1.default({
            name,
            email,
            password: hashedPassword,
            verificationHash,
        });
        yield user.save({ session });
        // Commit the transaction
        yield session.commitTransaction();
        // Prepare email content
        const subject = "Zuhu - Please Verify Your Email Address";
        const verificationLink = `${process.env.SITE_DOMAIN}/api/auth/verify?id=${user._id}&token=${verificationHash}`;
        const description = `
      <p>Thank you for signing up at Zuhu! Please verify your email address by clicking the link below:</p>
      <a href="${verificationLink}">Verify your email</a>
      <p>If you did not create an account, please ignore this email.</p>
    `;
        const emailService = new email_service_1.default();
        yield emailService.sendEmail(email, subject, "", description);
        return {
            success: true,
            message: "Successfully signed up. Please check your email to verify your account.",
            status: 200,
            data: null,
        };
    }
    catch (error) {
        if (session.inTransaction()) {
            yield session.abortTransaction();
        }
        let errorMessage = "An error occurred during signup.";
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        else {
            console.error("Unexpected error:", error); // Log the error for debugging
        }
        return {
            success: false,
            message: errorMessage,
            status: 500,
            data: null,
        };
    }
    finally {
        session.endSession();
    }
});
exports.signup = signup;
const verifyAccount = (userId, token) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const user = yield User_1.default.findById(userId);
        if (!user) {
            throw new Error("No user exists");
        }
        const doesHashMatch = user.verificationHash === token;
        if (!doesHashMatch) {
            throw new Error("Invalid authorization link");
        }
        yield User_1.default.findByIdAndUpdate(userId, { $set: { isVerified: true } }, { session });
        yield session.commitTransaction();
        return {
            success: true,
            message: "Account successfully verified",
            status: 200,
            data: null,
        };
    }
    catch (error) {
        if (session.inTransaction()) {
            yield session.abortTransaction();
        }
        let errorMessage = "An error occurred during account verification.";
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        else {
            console.error("Unexpected error:", error);
        }
        return {
            success: false,
            message: errorMessage,
            status: 500,
            data: null,
        };
    }
    finally {
        session.endSession();
    }
});
exports.verifyAccount = verifyAccount;
