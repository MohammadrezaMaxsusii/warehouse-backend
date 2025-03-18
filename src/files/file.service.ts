import { IResponseData } from "../shared/interfaces/response-data.interface";
import { RepoFactory } from "../shared";
import { FileRepository } from "./file.repository";
import { IPayload } from "../auth/interfaces/jwt-payload.interface";
import { IUploadFileData } from "./dto/upload-file.dto";
import { Types } from "mongoose";
import minioclient from "../database/minio";
import { configurations } from "../config/configurations";
import { IParamIdDto } from "../shared/dtos/requests/param-id.dto";
import httpStatus from "http-status";
import { IResponseDataForFiles } from "../shared/interfaces/response-data-for-file.interface";

const fileRepo = RepoFactory.getRepo<FileRepository>("file");

export const uploadFile = async (
  data: IUploadFileData,
  payload: IPayload
): Promise<IResponseData> => {
  const thisFile = await fileRepo.create({
    name: data.name,
    size: data.size,
    type: data.mimetype,
    uploader: new Types.ObjectId(payload.userId),
  });

  await minioclient.putObject(
    configurations.minio.bucketName,
    thisFile._id.toString().concat(".", data.mimetype.split("/")[1]),
    data.data
  );

  return { data: { id: thisFile._id } };
};

export const deleteFile = async (
  data: IParamIdDto,
  payload: IPayload
): Promise<IResponseData> => {
  const thisFile = await fileRepo.findOneAndSoftDelete({
    _id: data._id,
  });

  if (!thisFile) {
    return {
      statusCode: httpStatus.NOT_FOUND,
      message: "فایل پیدا نشد",
    };
  }

  if (thisFile.type) {
    await minioclient.removeObject(
      configurations.minio.bucketName,
      thisFile._id.toString().concat(".", thisFile.type!.split("/")[1])
    );
  }

  return { data: { id: thisFile._id } };
};

export const getFile = async (
  data: IParamIdDto,
  payload: IPayload
): Promise<IResponseDataForFiles> => {
  const thisFile = await fileRepo.findOne({
    _id: data._id,
  });

  if (!thisFile) {
    return {
      statusCode: httpStatus.NOT_FOUND,
      message: "فایل پیدا نشد",
    };
  }

  const fileData = await minioclient.getObject(
    configurations.minio.bucketName,
    thisFile._id.toString().concat(".", (thisFile.type as string).split("/")[1])
  );

  return {
    data: thisFile,
    readableStream: fileData,
    isFile: true,
  };
};

/*-----------------------Exported Methods-----------------------*/
export const getCountofAvailableFiles = async (
  fileIds: string[]
): Promise<number> => {
  return await fileRepo.countAll({
    _id: {
      $in: fileIds.map((id) => new Types.ObjectId(id as string)),
    },
  });
};
