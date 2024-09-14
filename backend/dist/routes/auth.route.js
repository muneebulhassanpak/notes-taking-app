"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AuthController_1 = require("../controllers/AuthController");
const router = express_1.default.Router();
router.post("/signup", AuthController_1.signupController);
router.get("/verify", AuthController_1.accountVerificationController);
router.post("/signin", AuthController_1.signin);
exports.default = router;
