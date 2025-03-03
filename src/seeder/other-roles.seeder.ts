import { RoleRepository } from "../roles/role.repository";
import { RepoFactory } from "../shared";
import { SUPER_ADMIN_ROLE } from "../shared/constants/super-admin-role.constant";
import { ProjectRole } from "../shared/enums/project.roles.enum";

const roleRepo = RepoFactory.getRepo<RoleRepository>("role");

export async function otherRolesSeeder() {
  await technicalManagerSeeder();
  await foreignBuyerSeeder();
  await foreignSellerSeeder();
  await ictBuyerSeeder();
  await ictSellerSeeder();
  await warehouseManagerSeeder();
}

async function technicalManagerSeeder() {
  const thisRole = ProjectRole.Technical_Manager;

  const exists = await roleRepo.findOne({
    name: thisRole,
  });

  if (!exists) {
    await roleRepo.create({ name: thisRole });
  }
}

async function foreignBuyerSeeder() {
  const thisRoleManager = ProjectRole.Foreign_Buyer_Manager;
  const thisRoleExpert = ProjectRole.Foreign_Buyer_Expert;

  let existsManager = await roleRepo.findOne({
    name: thisRoleManager,
  });

  let existsExpert = await roleRepo.findOne({
    name: thisRoleExpert,
  });

  if (!existsManager) {
    existsManager = await roleRepo.create({ name: thisRoleManager });
  }

  if (!existsExpert) {
    existsExpert = await roleRepo.create({
      name: thisRoleExpert,
      pid: existsManager._id,
    });
  }
}

async function foreignSellerSeeder() {
  const thisRoleManager = ProjectRole.Foreign_Seller_Manager;
  const thisRoleExpert = ProjectRole.Foreign_Seller_Expert;

  let existsManager = await roleRepo.findOne({
    name: thisRoleManager,
  });

  let existsExpert = await roleRepo.findOne({
    name: thisRoleExpert,
  });

  if (!existsManager) {
    existsManager = await roleRepo.create({ name: thisRoleManager });
  }

  if (!existsExpert) {
    existsExpert = await roleRepo.create({
      name: thisRoleExpert,
      pid: existsManager._id,
    });
  }
}

async function ictBuyerSeeder() {
  const thisRoleManager = ProjectRole.ICT_Buyer_Manager;
  const thisRoleExpert = ProjectRole.ICT_Buyer_Expert;

  let existsManager = await roleRepo.findOne({
    name: thisRoleManager,
  });

  let existsExpert = await roleRepo.findOne({
    name: thisRoleExpert,
  });

  if (!existsManager) {
    existsManager = await roleRepo.create({ name: thisRoleManager });
  }

  if (!existsExpert) {
    existsExpert = await roleRepo.create({
      name: thisRoleExpert,
      pid: existsManager._id,
    });
  }
}

async function ictSellerSeeder() {
  const thisRoleManager = ProjectRole.ICT_Seller_Manager;
  const thisRoleExpert = ProjectRole.ICT_Seller_Expert;

  let existsManager = await roleRepo.findOne({
    name: thisRoleManager,
  });

  let existsExpert = await roleRepo.findOne({
    name: thisRoleExpert,
  });

  if (!existsManager) {
    existsManager = await roleRepo.create({ name: thisRoleManager });
  }

  if (!existsExpert) {
    existsExpert = await roleRepo.create({
      name: thisRoleExpert,
      pid: existsManager._id,
    });
  }
}

async function warehouseManagerSeeder() {
  const thisRole = ProjectRole.Warehouse_Manager;

  const exists = await roleRepo.findOne({
    name: thisRole,
  });

  if (!exists) {
    await roleRepo.create({ name: thisRole });
  }
}
