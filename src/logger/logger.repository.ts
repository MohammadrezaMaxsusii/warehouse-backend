import { Model } from "mongoose";
import { BaseRepository } from "../shared";
import { ILogger } from "./interfaces/logger.interface";

export class LoggerRepository extends BaseRepository<ILogger> {
  constructor(private readonly loggerModel: Model<ILogger>) {
    super(loggerModel);
  }
}
