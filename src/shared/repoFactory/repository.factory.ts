import { FileRepository } from "../../files/file.repository";
import { FileModel } from "../../files/file.schema";
import { PermissionRepository } from "../../permissions/permission.repository";
import { PermissionModel } from "../../permissions/permission.schema";
import { RoleRepository } from "../../roles/role.repository";
import { UserRepository } from "../../users/user.repository";
import { UserModel } from "../../users/user.schema";
import { LoggerRepository } from "../../logger/logger.repository";
import { LoggerModel } from "../../logger/schemas/logger.schema";
import { StoreRepository } from "../../store/store.repository";
import { StoreModel } from "../../store/store.schema";
import { TaskRepository } from "../../tasks/tasks.repository";
import { TaskModel } from "../../tasks/tasks.schema";
import { ProjectRepository } from "../../projects/project.repository";
import { ProjectModel } from "../../projects/project.schema";
import { ProductRepository } from "../../products/product.repository";
import { ProductModel } from "../../products/product.schema";
import { RoleModel } from "../../roles/role.schema";
import { UnitRepository } from "../../unit/unit.repository";
import { UnitModel } from "../../unit/unit.schema";
import { WorkflowModel } from "../../workflow/workflow.schema";
import { WorkflowRepository } from "../../workflow/workflow.repository";
import { FormModel } from "../../forms/forms.schema";
import { FormsRepository } from "../../forms/forms.repository";
import { WorkflowTaskModel } from "../../workflow-tasks/workflowTask.schema";
import { WorkflowTaskRepository } from "../../workflow-tasks/workflowTask.repository";
import { RouterRepository } from "../../routes/routes.repository";
import { RouterModel } from "../../routes/routes.schema";
type repoTypes =
  | "permission"
  | "role"
  | "user"
  | "file"
  | "logger"
  | "store"
  | "task"
  | "project"
  | "product"
  | "unit"
  | "workflow"
  | "forms"
  | "workflowTask"
  | "route";

class RepositoryFactory {
  private static instance: RepositoryFactory;

  constructor(
    private readonly permissionRepo = new PermissionRepository(PermissionModel),
    private readonly roleRepo = new RoleRepository(RoleModel),
    private readonly userRepo = new UserRepository(UserModel),
    private readonly fileRepo = new FileRepository(FileModel),
    private readonly loggerRepo = new LoggerRepository(LoggerModel),
    private readonly storeRepo = new StoreRepository(StoreModel),
    private readonly taskRepo = new TaskRepository(TaskModel),
    private readonly projectRepo = new ProjectRepository(ProjectModel),
    private readonly productRepo = new ProductRepository(ProductModel),
    private readonly UnitRepo = new UnitRepository(UnitModel),
    private readonly workflowRepo = new WorkflowRepository(WorkflowModel),
    private readonly formsRepo = new FormsRepository(FormModel),
    private readonly workflowTaskRepo = new WorkflowTaskRepository(
      WorkflowTaskModel
    ),
    private readonly routeRepo = new RouterRepository(RouterModel),
  ) {}

  /*************  ✨ Codeium Command ⭐  *************/
  /******  0dc13335-9e64-4120-af58-5655378f8a92  *******/
  getRepo<T>(type: repoTypes): T {
    switch (type) {
      case "permission":
        return this.permissionRepo as T;
      case "role":
        return this.roleRepo as T;
      case "user":
        return this.userRepo as T;
      case "file":
        return this.fileRepo as T;

      case "logger":
        return this.loggerRepo as T;

      case "store":
        return this.storeRepo as T;

      case "task":
        return this.taskRepo as T;

      case "project":
        return this.projectRepo as T;

      case "product":
        return this.productRepo as T;

      case "unit":
        return this.UnitRepo as T;

      case "workflow":
        return this.workflowRepo as T;

      case "forms":
        return this.formsRepo as T;

      case "workflowTask":
        return this.workflowTaskRepo as T;
      
      case "route":
        return this.routeRepo as T;
      default:
        throw new Error(`Unknown repository type: ${type}`);
    }
  }
  public static getInstance(): RepositoryFactory {
    if (!RepositoryFactory.instance) {
      RepositoryFactory.instance = new RepositoryFactory();
    }
    return RepositoryFactory.instance;
  }
}

const factoryInstance = RepositoryFactory.getInstance();

export default factoryInstance;
