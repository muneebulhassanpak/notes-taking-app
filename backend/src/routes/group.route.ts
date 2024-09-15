import express from "express";
import { createGroupController } from "../controllers/GroupController";
const router = express.Router();

router.post("/create-group", createGroupController);

export default router;
