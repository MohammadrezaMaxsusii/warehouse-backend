import { RoleRepository } from "../roles/role.repository";
import { RoleModel } from "../roles/role.schema";
import { RepoFactory } from "../shared";
import { SUPER_ADMIN_ROLE } from "../shared/constants/super-admin-role.constant";

const roleRepo = RepoFactory.getRepo<RoleRepository>("role");

export async function superAdminRoleSeeder() {
  const isExistSuperAdminRole = await roleRepo.findOne({
    name: SUPER_ADMIN_ROLE,
  });

  if (isExistSuperAdminRole) {
    return;
  }

  const createRoleData = { name: SUPER_ADMIN_ROLE };

  await roleRepo.create(createRoleData);

  return;
}
