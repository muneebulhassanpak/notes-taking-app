import express from "express";
import {
  signupController,
  accountVerificationController,
} from "../controllers/AuthController";
const router = express.Router();

router.post("/signup", signupController);
router.get("/verify", accountVerificationController);

export default router;
