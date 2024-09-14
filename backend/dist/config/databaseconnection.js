"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectWithDatabase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
let url = process.env.DATABASE_URL;
const connectWithDatabase = () => {
    mongoose_1.default
        .connect(url)
        .then(() => {
        console.log("Connection with database successful");
    })
        .catch((err) => {
        console.log("Error connecting with database ", err);
    });
};
exports.connectWithDatabase = connectWithDatabase;
