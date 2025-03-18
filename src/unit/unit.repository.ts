import { Model } from "mongoose";
import { BaseRepository } from "../shared";
import { IUnit } from "./unit.interface";

export class UnitRepository extends BaseRepository<IUnit> {
  constructor(private readonly unitModel: Model<IUnit>) {
    super(unitModel);
  }
}
