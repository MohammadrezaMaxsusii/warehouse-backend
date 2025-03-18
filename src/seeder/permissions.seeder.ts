import { PermissionRepository } from "../permissions/permission.repository";
import { RepoFactory } from "../shared";
import { filePermissionsEnum } from "../files/enums/file-permission.enum";
import { permissionPermissionsEnum } from "../permissions/enums/permission-permissions.enum";
import { rolePermissionsEnum } from "../roles/enums/role-permissions.enum";
import { userPermissionsEnum } from "../users/enums/user-permissions.enum";
import { taskPermissionsEnum } from "../tasks/enums/task-permissions.enum";
import { ProductPermissionsEnum } from "../products/enums/product-permissions.enum";
import { ProjectPermissionsEnum } from "../projects/enums/project-permissions.enum";

const allPermissions = [
  //
  //
  // BASE   PERMISSIONS
  ...Object.values(permissionPermissionsEnum),
  ...Object.values(filePermissionsEnum),
  ...Object.values(rolePermissionsEnum),
  ...Object.values(userPermissionsEnum),
  ...Object.values(taskPermissionsEnum),
  ...Object.values(ProductPermissionsEnum),
  ...Object.values(ProjectPermissionsEnum),
];

const permissionRepo = RepoFactory.getRepo<PermissionRepository>("permission");

export async function permissionSeeder() {
  await Promise.all(
    allPermissions.map((item) => permissionRepo.upsert({ name: item }, {}))
  );
}
