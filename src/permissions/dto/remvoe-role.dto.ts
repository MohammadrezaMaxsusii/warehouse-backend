import { AddRoleToPermissionDto, IAddRoleToPermission } from "./add-role.dto";

export interface IRemoveRoleFromPermission extends IAddRoleToPermission {}

export const RemoveRoleFromPermissionDto = AddRoleToPermissionDto;
