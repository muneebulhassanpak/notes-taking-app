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
exports.signin = exports.accountVerificationController = exports.signupController = void 0;
const User_1 = __importDefault(require("../models/User"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// const { validationResult } from "express-validator";
const auth_service_1 = require("../services/auth.service");
// Sign up
const signupController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    // let errors = validationResult(req);
    try {
        // if (!errors.isEmpty()) {
        //   return next(new Error(errors));
        // }
        const response = yield (0, auth_service_1.signup)(name, email, password);
        return res.json(response);
    }
    catch (error) {
        console.log(error);
        next(error);
    }
});
exports.signupController = signupController;
// Account Verification
const accountVerificationController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.query.id;
    const token = req.query.token;
    if (!id || !token) {
        return next(new Error("Invalid or missing query parameters"));
    }
    try {
        const response = yield (0, auth_service_1.verifyAccount)(id, token);
        return res.json(response);
    }
    catch (error) {
        console.log(error);
        next(error);
    }
});
exports.accountVerificationController = accountVerificationController;
//Sign in
const signin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, userpassword } = req.body;
    if (!email || !userpassword) {
        return next(new Error("Missing credentials"));
    }
    try {
        const user = yield User_1.default.findOne({ email: email }).exec();
        if (!user) {
            return next(new Error("Incorrect login credentials"));
        }
        const passwordComparison = yield bcrypt_1.default.compare(userpassword, user.password);
        if (!passwordComparison) {
            return next(new Error("Incorrect login credentials"));
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id }, "loremipsumdollarsmit");
        console.log(token);
        res
            .header("Access-Control-Allow-Credentials", "true")
            .cookie("access_token", token, {
            sameSite: "none",
            httpOnly: true,
        });
        return res.status(200).json({
            status: 200,
            message: "Successfully Logged in",
            user: user,
            token,
        });
    }
    catch (err) {
        console.log(err);
    }
});
exports.signin = signin;
