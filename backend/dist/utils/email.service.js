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
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class EmailService {
    constructor() {
        this.transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            secure: true,
            port: 465,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
    }
    sendEmail(to, subject, text, html) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const mailOptions = {
                    from: process.env.EMAIL_USER,
                    to,
                    subject,
                    text,
                    html,
                };
                const info = yield this.transporter.sendMail(mailOptions);
                return info.response;
            }
            catch (error) {
                console.error("Error sending email:", error);
                if (error instanceof Error) {
                    throw new Error(`Email could not be sent: ${error.message}`);
                }
                else {
                    throw new Error("Email could not be sent due to an unknown error.");
                }
            }
        });
    }
}
exports.default = EmailService;
