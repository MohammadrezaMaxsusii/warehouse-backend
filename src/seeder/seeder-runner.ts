import { generateFormsFromModelsSeeder } from "./form.generate.seeder";
import { otherRolesSeeder } from "./other-roles.seeder";
import { unitSeeder } from "./other-unit.seeder";
import { permissionSeeder } from "./permissions.seeder";
import createRoutesSeeder from "./routes.seeder";
import { superAdminRoleSeeder } from "./super-admin-role.seeder";
import { superAdminUserSeeder } from "./super-admin-user.seeder";

export async function SeederRunner() {
  await superAdminRoleSeeder();
  await superAdminUserSeeder();
  await permissionSeeder();
  await otherRolesSeeder();
  await unitSeeder();
  await generateFormsFromModelsSeeder();
  await createRoutesSeeder();
  console.log("🌱\tSeeder Executed...");

  return;
}

