import { Model } from "mongoose";
import { BaseRepository } from "../shared";
import { IEntity } from "./entity.interface";

export class EntityRepository extends BaseRepository<IEntity> {
  constructor(private readonly roleModel: Model<IEntity>) {
    super(roleModel);
  }
}
