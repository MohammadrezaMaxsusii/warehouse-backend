import { Types } from "mongoose";
import { RepoFactory } from "../../shared";
import { FileRepository } from "../file.repository";

const fileRepo = RepoFactory.getRepo<FileRepository>("file");

export const fileExists = async (fileId: Types.ObjectId): Promise<boolean> => {
  return !!(await fileRepo.findOne({ _id: fileId }));
};
