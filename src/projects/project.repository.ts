import { Model } from "mongoose";
import { BaseRepository } from "../shared";
import { IProject } from "./project.interface";

export class ProjectRepository extends BaseRepository<IProject> {
  constructor(private readonly ProjectModel: Model<IProject>) {
    super(ProjectModel);
  }
}
