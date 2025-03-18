import { Types } from "mongoose";
import { RepoFactory } from "../../shared";
import { FileRepository } from "../../files/file.repository";
import httpStatus from "http-status";
import { ProductErrorMessages } from "../../products/enums/product-messages.enum";
import minioclient from "../../database/minio";
import { configurations } from "../../config/configurations";
import { ProjectRole } from "../../shared/enums/project.roles.enum";
import { RoleRepository } from "../../roles/role.repository";
import { ProductRepository } from "../../products/product.repository";
import { ProjectSuccessMessages } from "../enums/project-messages.enum";
import { TaskRepository } from "../../tasks/tasks.repository";
import { Task_Statuses_Enum } from "../../tasks/enums/task-statuses.enum";
import { taskManagementFlowList } from "../../taskMnagement/enums/taskManagement-messages.enum";
const fileRepo = RepoFactory.getRepo<FileRepository>("file");
const roleRepo = RepoFactory.getRepo<RoleRepository>("role");
const ProductRepo = RepoFactory.getRepo<ProductRepository>("product");
const TaskRepo = RepoFactory.getRepo<TaskRepository>("task");
const XLSX = require("xlsx");

interface IProps {
  excelId: Types.ObjectId;
  projectId: Types.ObjectId;
  assignerRole: string;
}
export const createProjectPruductsWithCsv = async (props: IProps) => {
  const { excelId, projectId, assignerRole } = props;
  const thisFile = await fileRepo.findOne({
    _id: excelId,
    type: "text/csv",
  });

  if (!thisFile) {
    return {
      statusCode: httpStatus.NOT_FOUND,
      message: ProductErrorMessages.CSV_FILE_NOT_FOUND,
    };
  }

  const fileData = await minioclient.getObject(
    configurations.minio.bucketName,
    thisFile._id.toString().concat(".", (thisFile.type as string).split("/")[1])
  );

  const assigneeRoleRoleId = await roleRepo.findOne({
    name: ProjectRole.Technical_Manager,
  });

  const chunks = [];
  for await (const chunk of fileData) {
    chunks.push(chunk);
  }
  const buffer = Buffer.concat(chunks);
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const jsonData = XLSX.utils.sheet_to_json(worksheet);

  for (let i = 0; i < jsonData.length; i++) {
    const result = await ProductRepo.create({
      project: projectId,
      name: jsonData[i].name,
      type: jsonData[i].type,
      brand: jsonData[i].brand,
      partNumber: jsonData[i].PartNumber,
      description: jsonData[i].Description,
      serialNumber: jsonData[i].serialNumber || "",
    });
    const createTask = await TaskRepo.create({
      description: "محصول را تایید کنید",
      status: Task_Statuses_Enum.TODO,
      assigneeRole: assigneeRoleRoleId?._id,
      assignerRole: new Types.ObjectId(assignerRole),
      project: jsonData[i].projectCode,
      products: [result._id],
      taskFlowDesc: taskManagementFlowList.PRUDUCT_CREATE,
    });
  }

  return {
    statusCode: httpStatus.CREATED,
    message: ProjectSuccessMessages.CREATED,
    data: "result",
  };
};
