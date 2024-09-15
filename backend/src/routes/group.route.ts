import express from "express";
import { createGroupController } from "../controllers/GroupController";
import {
  hasAttachedCookie,
  userExists,
  isUserVerified,
} from "../utils/middlewares.service";
const router = express.Router();

router.post(
  "/create-group",
  hasAttachedCookie,
  userExists,
  isUserVerified,
  createGroupController
);

export default router;
