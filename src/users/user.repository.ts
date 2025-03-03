import { Model } from "mongoose";
import { BaseRepository } from "../shared";
import { IUser } from "./user.interface";

export class UserRepository extends BaseRepository<IUser> {
  constructor(private readonly userModel: Model<IUser>) {
    super(userModel);
  }
}
