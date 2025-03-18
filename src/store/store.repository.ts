import { Model } from "mongoose";
import { BaseRepository } from "../shared";
import { IStore } from "./store.interface";

export class StoreRepository extends BaseRepository<IStore> {
  constructor(private readonly roleModel: Model<IStore>) {
    super(roleModel);
  }
}
