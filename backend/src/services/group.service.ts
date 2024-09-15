import mongoose from "mongoose";
import User from "../models/User";
import Group from "../models/Group";
import dotenv from "dotenv";
dotenv.config();

import { signup } from "./auth.service";

// Types
import { responseType } from "../types/generic.types";
import { membersType, accountCreationStatus } from "../types/group.types";

export const createGroup = async (
  userId: string,
  title: string,
  description: string = "",
  members: membersType = []
): Promise<responseType> => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const allSuccessUserIds: accountCreationStatus = [];
    const allFailureUserIds: accountCreationStatus = [];

    for (const email of members) {
      try {
        const accountCreationStatus = await signup(
          "temporary",
          email,
          "temporary"
        );

        if (!accountCreationStatus.status) {
          allFailureUserIds.push({
            userId: email,
            message: accountCreationStatus.message,
          });
        } else {
          allSuccessUserIds.push({
            userId: accountCreationStatus.data.id,
            message: accountCreationStatus.message,
          });
        }
      } catch (error) {
        allFailureUserIds.push({
          userId: email,
          message: "Error during signup process",
        });
      }
    }

    // Create the group only with successfully signed up users
    const group = new Group({
      title,
      description,
      members: allSuccessUserIds.map((user) => user.userId), // Extract only user IDs
      adminId: userId,
    });

    // Update the user's groups, not delete the user
    await User.findByIdAndUpdate(
      userId,
      { $push: { groups: group._id } },
      { session }
    );

    await group.save({ session });

    await session.commitTransaction();

    const data = {
      successfulInvites: allSuccessUserIds,
      failedInvites: allFailureUserIds,
    };

    return {
      success: true,
      message: "Group created and invites sent successfully.",
      status: 200,
      data: data,
    };
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    let errorMessage = "An error occurred during group creation.";
    if (error instanceof Error) {
      errorMessage = error.message;
    } else {
      console.error("Unexpected error:", error);
    }

    return {
      success: false,
      message: errorMessage,
      status: 500,
      data: null,
    };
  } finally {
    session.endSession();
  }
};
