import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
let url = process.env.DATABASE_URL!;

export const connectWithDatabase = () => {
  mongoose
    .connect(url)
    .then(() => {
      console.log("Connection with database successful");
    })
    .catch((err: any) => {
      console.log("Error connecting with database ", err);
    });
};
