import express from "express";
import {
  signupController,
  accountVerificationController,
  signinController,
} from "../controllers/AuthController";
const router = express.Router();

router.post("/signup", signupController);
router.get("/verify", accountVerificationController);
router.post("/signin", signinController);

export default router;
