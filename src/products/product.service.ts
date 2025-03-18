import { ProductRepository } from "./product.repository";
import { IResponseData } from "../shared/interfaces/response-data.interface";
import httpStatus from "http-status";
import { ListOptions } from "../shared/dtos/requests/list-options.dto";
import _ from "lodash";
import { IParamIdDto } from "../shared/dtos/requests/param-id.dto";
import { RepoFactory } from "../shared";
import {
  ProductErrorMessages,
  ProductSuccessMessages,
} from "./enums/product-messages.enum";
import { IProduct } from "./products.interface";
import { IPayload } from "../auth/interfaces/jwt-payload.interface";
import { Types } from "mongoose";
import { ProjectRepository } from "../projects/project.repository";
import { ProjectSuccessMessages } from "../projects/enums/project-messages.enum";
import { ICreateProductDto } from "./dto/create-product.dto";
const ProductRepo = RepoFactory.getRepo<ProductRepository>("product");
const ProjectRepo = RepoFactory.getRepo<ProjectRepository>("project");

export const createProduct = async (
  data: ICreateProductDto,
  payload: IPayload
): Promise<IResponseData> => {
  const project = await ProjectRepo.findOne({
    _id: data.project,
  });
  if (!project) {
    return {
      statusCode: httpStatus.NOT_FOUND,
      message: ProjectSuccessMessages.FOUND,
    };
  }
  if(data.parentPruductId){
    const parentPruduct = await ProductRepo.findOne({
      _id: data.parentPruductId,
    });
    if (!parentPruduct) {
      return {
        statusCode: httpStatus.NOT_FOUND,
        message: ProductErrorMessages.NOT_FOUND,
      };
    }
  }
  if(data.parentPruductId){
    const parentPruduct = await ProductRepo.findOne({
      _id: data.parentPruductId,
    });
    if (!parentPruduct) {
      return {
        statusCode: httpStatus.NOT_FOUND,
        message: ProductErrorMessages.NOT_FOUND,
      };
    }
  }
  const result = await ProductRepo.create({
    ...data,
    project: project._id,
  });

  await ProjectRepo.findOneAndUpdate(
    { _id: project._id },
    { $addToSet: { productIds: new Types.ObjectId(result._id) } }
  );

  return {
    statusCode: httpStatus.CREATED,
    message: ProductSuccessMessages.CREATED,
    data: result,
  };
};

export const findAllProducts = async (
  inputData: Partial<IProduct> & ListOptions
): Promise<IResponseData> => {
  const { data, options } = ListOptions.prepare(inputData);

  const result = await ProductRepo.findAll(data, options);

  for (let item of result) {
    if (item.project) {
      const project = await ProjectRepo.findOne({
        _id: item.project as Types.ObjectId,
      });

      if (project) {
        item.project = project;
      }
    }
  }
  const count = await ProductRepo.countAll(data, options);

  return {
    message: ProductSuccessMessages.LISTED,
    data: result,
    metadata: { totalCount: count },
  };
};

export const findOneProduct = async (
  data: Partial<IProduct>
): Promise<IResponseData> => {
  const result = await ProductRepo.findOne(data);

  if (!result) {
    return {
      statusCode: httpStatus.NOT_FOUND,
      message: ProductErrorMessages.NOT_FOUND,
    };
  }

  return {
    message: ProductSuccessMessages.FOUND,
    data: result,
  };
};

export const updateOneProduct = async (
  data: Partial<IProduct>
): Promise<IResponseData> => {
  const ProductExists = await ProductRepo.findOne(_.pick(data, ["_id"]));

  if (!ProductExists) {
    return {
      statusCode: httpStatus.NOT_FOUND,
      message: ProductErrorMessages.NOT_FOUND,
    };
  }

  const result = (await ProductRepo.findOneAndUpdate(
    _.pick(data, ["_id"]),
    _.omit(data, ["_id"])
  )) as IProduct;

  return {
    message: ProductSuccessMessages.UPDATED,
    data: result,
  };
};

export const deleteOneProduct = async (
  data: Partial<IProduct>
): Promise<IResponseData> => {
  const ProductExists = await ProductRepo.findOne(_.pick(data, ["_id"]));

  if (!ProductExists) {
    return {
      statusCode: httpStatus.NOT_FOUND,
      message: ProductErrorMessages.NOT_FOUND,
    };
  }

  const result = (await ProductRepo.findOneAndSoftDelete(
    _.pick(data, ["_id"])
  )) as IProduct;

  return {
    message: ProductSuccessMessages.DELETED,
    data: result,
  };
};

export const hardDeleteOneProduct = async (
  data: IParamIdDto
): Promise<IResponseData> => {
  const ProductExists = await ProductRepo.findOneAndHardDelete(data);

  if (!ProductExists) {
    return {
      statusCode: httpStatus.NOT_FOUND,
      message: ProductErrorMessages.NOT_FOUND,
    };
  }

  return {};
};
