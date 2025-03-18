import { connect, plugin } from "mongoose";
import { configurations } from "../config/configurations";

const connectDB = async () => {
  try {
    const mongoConfig = configurations.db;
    await connect(mongoConfig.uri, { dbName: mongoConfig.dbName });
    plugin(require("mongoose-autopopulate"));
    console.log("🛢\tMongoDB Connected...");
  } catch (err: any) {
    console.error("MongoDB Not Connected...");

    console.error(err.message);
    // Exit process with failure
    process.exit(1);
  }
};

export default connectDB;
