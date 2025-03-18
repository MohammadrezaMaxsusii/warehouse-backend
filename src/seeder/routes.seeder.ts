import { method } from "lodash";
import router from "../routes/main.routes";
import { RouterRepository } from "../routes/routes.repository";
import { RepoFactory } from "../shared";

export async function routerSeeder() {
  const routes = extractRoutes(router);
  return routes;
}

const routerRepo = RepoFactory.getRepo<RouterRepository>("route");
const extractRoutes = (router: any, basePath = "") => {
  let routes: any[] = [];
  let pathFilter = ["update", "create"];
  let methodFilter = ["get", "post"];
  router.stack.forEach((layer: any) => {
    if (layer.route) {
      const { path, methods } = layer.route;
      if (methods.post || methods.patch) {

        Object.keys(methods).forEach((method) => {
          routes.push({ path: basePath + path, method: method.toLowerCase() });
        });
      }
    } else if (layer.name === "router" && layer.handle.stack) {
      const cleanedPath = cleanPath(layer.regexp);
      const nestedRoutes = extractRoutes(
        layer.handle,
        basePath.toLowerCase() + cleanedPath
      );
      routes = routes.concat(nestedRoutes);
    }
  });

  return routes;
};
const cleanPath = (regexp: any) => {
  let path = regexp.source
    .replace("^\\/", "/")
    .replace("\\/?(?=\\/|$)", "")
    .replace(/\\\//g, "/");

  return path;
};

const createRoutesSeeder = async () => {
  const routes = await routerSeeder();

  for (const route of routes) {
    const exists = await routerRepo.findOne({ path: route.path });
    if (exists) {
      continue;
    }
    await routerRepo.create(route);
  }
};
export default createRoutesSeeder;
