import express from "express";
import { configurations } from "./config/configurations";
import connectDB from "./database/mongo";
import morgan from "morgan";
import appRoutes from "./routes/main.routes";
import { SeederRunner } from "./seeder/seeder-runner";
import { IResponseData } from "./shared/interfaces/response-data.interface";
import httpStatus from "http-status";
import cors from "cors";
import { JobsRunner } from "./shared/utils/functions/jobs-runner.function";



// #########################################################
// Create App Instance
const app = express();

// #########################################################
// Conncet To Database
connectDB();

// #########################################################
// Run Seeder
SeederRunner();

// #########################################################
// Run Jobs
JobsRunner();

// #########################################################
// Request Logger
app.use(morgan("dev"));

// #########################################################
// Manage CORS
app.use(
  cors({
    origin: "*",
  })
);

// #########################################################
// Body Parser
app.use(express.json(), express.urlencoded({ extended: false }));

// #########################################################
// Routing
app.use("/", appRoutes);

app.use("*", (req, res, next) => {
  let response: IResponseData = {
    statusCode: httpStatus.NOT_FOUND,
    message: "مسیر یافت نشد",
    error: true,
    data: {},
  };

  return res.status(404).json(response);
});

// #########################################################
// Run App
app.listen(configurations.app.port, "0.0.0.0" ,() => {
  console.log(`🌐\tServer running on port ${configurations.app.port}`);
});
