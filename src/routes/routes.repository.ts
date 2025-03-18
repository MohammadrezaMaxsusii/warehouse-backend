import { BaseRepository } from "../shared";
import { Model } from "mongoose";
import { IRoutes } from "./routes.interface";

export class RouterRepository extends BaseRepository<IRoutes> {
  constructor(private readonly ProductModel: Model<IRoutes>) {
    super(ProductModel);
  }
}
