import { Types } from "mongoose";
import { RoleRepository } from "../roles/role.repository";
import { RoleModel } from "../roles/role.schema";
import { UserRepository } from "../users/user.repository";
import { UserModel } from "../users/user.schema";
import { configurations } from "../config/configurations";
import { hash } from "bcrypt";
import { SUPER_ADMIN_ROLE } from "../shared/constants/super-admin-role.constant";
import { IRole } from "../roles/role.interface";
import { RepoFactory } from "../shared";

const roleRepo = RepoFactory.getRepo<RoleRepository>("role");
const userRepo = RepoFactory.getRepo<UserRepository>("user");

export async function superAdminUserSeeder() {
  const superAdminUserFound = await userRepo.findOne({
    username: configurations.app.superAdmin.username,
  });

  const superAdminRoleFound = await roleRepo.findOne({
    name: SUPER_ADMIN_ROLE,
  });

  if (!superAdminUserFound) {
    const username = configurations.app.superAdmin.username;
    const password = configurations.app.superAdmin.password;
    const hashedPassword = await hash(password, 10);

    const createSuperAdminData = {
      username,
      password: hashedPassword,
      roles: [superAdminRoleFound?._id as Types.ObjectId],
    };

    await userRepo.create(createSuperAdminData);


    return;
  } else if (
    superAdminUserFound &&
    !superAdminUserFound?.roles
      ?.map((role: IRole | Types.ObjectId) => role?._id?.toString())
      .includes(superAdminRoleFound?._id?.toString() as string)
  ) {
    await userRepo.findOneAndUpdate(
      { username: configurations.app.superAdmin.username },
      { $push: { roles: superAdminRoleFound?._id as Types.ObjectId } }
    );


    return;
  } else {
    return;
  }
}
