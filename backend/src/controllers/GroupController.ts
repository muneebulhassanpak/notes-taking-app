import { Response, NextFunction } from "express";
import dotenv from "dotenv";
dotenv.config();
import { createGroup } from "../services/group.service";
import { CustomizedRequest } from "../types/generic.types";

// Sign up
export const createGroupController = async (
  req: CustomizedRequest,
  res: Response,
  next: NextFunction
) => {
  let userId = req.user?.userId;
  let { title, description, members } = req.body;
  try {
    if (!title) {
      throw new Error("Group must have a name");
    }
    const response = await createGroup(userId!, title, description, members);
    return res.json(response);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
