import mongoose, { Schema, SchemaType } from "mongoose";
import { FormFieldTypeEnum } from "../forms/enums/formTypes.enum";
import { IFormsFields } from "../forms/forms.interface";
import { FormsRepository } from "../forms/forms.repository";
import { RepoFactory } from "../shared";
import minioclient from "../database/minio";
const { createObjectCsvStringifier } = require("csv-writer");
const FormsRepo = RepoFactory.getRepo<FormsRepository>("forms");
import { Types } from "mongoose";
import { configurations } from "../config/configurations";
import { FileRepository } from "../files/file.repository";
const fileRepo = RepoFactory.getRepo<FileRepository>("file");
const getLabelTranslation = (path: string): string => {
  const dict: { [key: string]: string } = {
    name: "نام",
    code: "کد",
    description: "توضیحات",
    files: "فایل های مروبطه",
    status: "وضعیت",
    unit: "واحد",
    dates: "تاریخ",
    cellPhone: "شماره تلفن",
    email: "ایمیل",
    type: "نوع",
    brand: "برند",
    partNumber: "پارت نامبر",
    serialNumber: "شماره سریال",
  };
  return dict[path];
};
const mapTypeToInput = async (type: string): Promise<FormFieldTypeEnum> => {
  switch (type) {
    case "String":
      return FormFieldTypeEnum.TEXT;
    case "Number":
      return FormFieldTypeEnum.NUMBER;
    case "Boolean":
      return FormFieldTypeEnum.CHECKBOX;
    case "Date":
      return FormFieldTypeEnum.DATE;
    case "Array":
      return FormFieldTypeEnum.SELECT_MULTIPLE;
    case "file":
      return FormFieldTypeEnum.FILE;
    default:
      return FormFieldTypeEnum.TEXT;
  }
};
const csvGenerator = async (fields: IFormsFields[], fileName: string) => {
  let csvHeader = [];
  const thisFile = await fileRepo.create({
    name: fileName,
    type: "text/csv",
    uploader: new Types.ObjectId(),
  });
  for (const field of fields) {
    csvHeader.push({
      id: field.name,
      title: field.name,
    });
  }

  const csvStringifier = createObjectCsvStringifier({
    header: csvHeader,
  });
  const csvHeaders = csvStringifier.getHeaderString();

  const csvBuffer = Buffer.from(csvHeaders, "utf-8");
  const bucketName = configurations.minio.bucketName;
  const objectName = thisFile._id.toString() + ".csv";
  minioclient.putObject(bucketName, objectName, csvBuffer);

  return thisFile._id.toString();
};

const extractFields = async (
  schema: mongoose.Schema
): Promise<IFormsFields[]> => {
  let fields: IFormsFields[] = [];

  const fieldsblackList = ["createdAt", "updatedAt", "deletedAt", "_id", "pid"];

  for (const [path, type] of Object.entries(schema.paths)) {
    if (!fieldsblackList.includes(path)) {
      console.log("🔍 Processing Path:", path);

      const fieldType = path.toLowerCase().includes("file")
        ? await mapTypeToInput("file")
        : path.toLowerCase().includes("date")
        ? await mapTypeToInput("Date")
        : await mapTypeToInput(type.instance);

      fields.push({
        _id: new mongoose.Types.ObjectId(),
        name: path,
        label: getLabelTranslation(path) || path,
        type: fieldType,
        required: !!type.options?.required,
        options: [],
        defaultValue: "",
        key: `${Math.random().toString(36).substr(2, 9)}`,
        relatedForms: [],
        relatedInstance: type.options?.ref ? type.options?.ref : undefined,
        relatedInstanceApi: type.options?.ref
          ? {
              method: "get",
              url: `/${(type.options.ref as string).toLowerCase()}/list`,
            }
          : undefined,
      });
    }
  }

  return fields;
};

const extractUpdatedFields = async (
  schema: mongoose.Schema
): Promise<IFormsFields[]> => {
  let fields: IFormsFields[] = [];
  const fieldsblackList = ["createdAt", "updatedAt", "deletedAt", "_id", "pid"];
  schema.eachPath(async (path, type) => {
    if (!fieldsblackList.includes(path)) {
      if (type.instance === "ObjectID" && type.options?.ref) {
        fields.push({
          _id: new mongoose.Types.ObjectId(),
          name: path,
          label: getLabelTranslation(path) || path,
          type: path.toLowerCase().includes("file")
            ? await mapTypeToInput("file")
            : path.toLocaleLowerCase().includes("date")
            ? await mapTypeToInput("Date")
            : await mapTypeToInput(type.instance),
          required: false,
          options: [],
          defaultValue: "",
          key: `${Math.random().toString(36).substr(2, 9)}`,
          relatedForms: [type.options.ref],
          relatedInstance: type.options?.ref ? type.options?.ref : undefined,
          relatedInstanceApi: type?.options?.ref
            ? {
                method: "get",
                url: type?.options?.ref
                  ? `/${(type?.options?.ref as string).toLowerCase()}/list`
                  : undefined,
              }
            : undefined,
        });
      } else {
        fields.push({
          _id: new mongoose.Types.ObjectId(),
          name: path,
          label: getLabelTranslation(path) || path,
          type: path.toLowerCase().includes("file")
            ? await mapTypeToInput("file")
            : path.toLocaleLowerCase().includes("date")
            ? await mapTypeToInput("Date")
            : await mapTypeToInput(type.instance),
          required: false,
          options: [],
          defaultValue: "",
          key: `${Math.random().toString(36).substr(2, 9)}`,
          relatedForms: [],
          relatedInstance: type.options?.ref ? type.options?.ref : undefined,
          relatedInstanceApi: type?.options?.ref
            ? {
                method: "get",
                url: type?.options?.ref
                  ? `/${(type?.options?.ref as string).toLowerCase()}/list`
                  : undefined,
              }
            : undefined,
        });
      }
    }
  });

  return fields;
};

const whiteList = ["Product", "Project"];
const formName: { [key: string]: string } = {
  Product: " محصولات",
  Project: " پروژه",
};
const generateFormsFromModelsSeeder = async () => {
  for (const modelName of Object.keys(mongoose.models)) {
    if (!whiteList.includes(modelName)) {
      continue;
    }

    const schema = mongoose.models[modelName].schema;
    const fields = await extractFields(schema);
    const csv = await csvGenerator(fields, formName[modelName]);
    const updatedFields = await extractUpdatedFields(schema);
    const existingForm = await FormsRepo.findOne({ refrence: modelName });

    if (existingForm) {
      console.log(`form ${modelName} updated`);
    } else {
      await FormsRepo.create({
        refrence: modelName,
        api: {
          method: "post",
          url: `/${modelName}/create`,
        },
        name: ` فرم ساخت ${formName[modelName]}`,
        type: "create",
        fields,
        tempCsvId: csv,
      });
      await FormsRepo.create({
        refrence: modelName,
        api: {
          method: "post",
          url: `/${modelName}/update/:id`,
        },
        name: ` فرم به روز رسانی ${formName[modelName]}`,
        type: "update",
        fields: updatedFields,
        
      });
      console.log(`form ${modelName} created`);
    }
  }
};

export { generateFormsFromModelsSeeder };
