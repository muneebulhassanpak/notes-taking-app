import dotnenv from "dotenv";
dotnenv.config();
import express, { Request, Response, NextFunction } from "express";
import authRoute from "./routes/auth.route";
import mongoose from "mongoose";
import { connectWithDatabase } from "./config/databaseconnection";

const app = express();

app.use(express.json());

//Connnect to database
connectWithDatabase();

app.use("/api/auth", authRoute);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const code = err.status || 500;
  return res.status(code).json({
    success: false,
    message: err.message || "Something went wrong",
    status: code,
  });
});

const PORT = process.env.PORT || 3000;

mongoose.connection.once("open", () => {
  app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
  });
});

mongoose.connection.on("error", () => {
  console.log(
    "Probably due to connection with the database server, Server closed"
  );
  process.exit(1);
});
