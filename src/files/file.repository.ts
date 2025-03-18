import { Model, Schema, Types } from "mongoose";
import { BaseRepository } from "../shared";
import { IFile } from "./file.interface";
export class FileRepository extends BaseRepository<IFile> {
  thisModel: Model<IFile>;
  constructor(private readonly fileModel: Model<IFile>) {
    super(fileModel);
    this.thisModel = fileModel;
  }

  async allIdsExists(ids: Types.ObjectId[]): Promise<boolean> {
    const files = await this.thisModel.find({ _id: ids });

    return files.length === ids.length;
  }
}
