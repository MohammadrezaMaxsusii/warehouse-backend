import { Model, Types } from "mongoose";
import { BaseRepository } from "../shared";
import { IPermission } from "./permission.interface";

export class PermissionRepository extends BaseRepository<IPermission> {
  constructor(private readonly permissionModel: Model<IPermission>) {
    super(permissionModel);
  }

  async getRolePermissions(
    roleId: Types.ObjectId
  ): Promise<Omit<IPermission, "roles">[]> {
    return await this.permissionModel.find<IPermission>(
      {
        roles: { $in: [roleId] },
        deletedAt: null,
      },
      { roles: 0 }
    );
  }
}
