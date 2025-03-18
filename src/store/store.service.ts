import { StoreRepository } from "./store.repository";
import { IStore } from "./store.interface";
import { IResponseData } from "../shared/interfaces/response-data.interface";
import httpStatus from "http-status";
import { ListOptions } from "../shared/dtos/requests/list-options.dto";
import _ from "lodash";
import { IParamIdDto } from "../shared/dtos/requests/param-id.dto";
import { PermissionRepository } from "../permissions/permission.repository";
import { RepoFactory } from "../shared";
import { StoreErrorMessages, StoreSuccessMessages } from "./enums/store-messages.enum";

const permissionRepo = RepoFactory.getRepo<PermissionRepository>("permission");
const storeRepo = RepoFactory.getRepo<StoreRepository>('store')
export const createStore = async (
  data: Partial<IStore>
): Promise<IResponseData> => {
  const duplicateStore = await storeRepo.findOne({ name: data.name });

  if (duplicateStore) {
    return {
      statusCode: httpStatus.CONFLICT,
      message: StoreErrorMessages.DUPLICATE,
    };
  }

  const result = await storeRepo.create(data);

  return {
    statusCode: httpStatus.CREATED,
    message: StoreSuccessMessages.CREATED,
    data: result,
  };
};

export const findAllStores = async (
  inputData: Partial<IStore> & ListOptions
): Promise<IResponseData> => {
  const { data, options } = ListOptions.prepare(inputData);

  const result = await storeRepo.findAll(data, options);

  const count = await storeRepo.countAll(data, options);

  return {
    message: StoreSuccessMessages.LISTED,
    data: result,
    metadata: { totalCount: count },
  };
};

export const findOneStore = async (
  data: Partial<IStore>
): Promise<IResponseData> => {
  const result = await storeRepo.findOne(data);

  if (!result) {
    return {
      statusCode: httpStatus.NOT_FOUND,
      message: StoreErrorMessages.NOT_FOUND,
    };
  }

  return {
    message: StoreSuccessMessages.FOUND,
    data: result,
  };
};

export const updateOneStore = async (
  data: Partial<IStore>
): Promise<IResponseData> => {
  const storeExists = await storeRepo.findOne(_.pick(data, ["_id"]));

  if (!storeExists) {
    return {
      statusCode: httpStatus.NOT_FOUND,
      message: StoreErrorMessages.NOT_FOUND,
    };
  }



  const duplicateStore = await storeRepo.findOne({ name: data?.name });

  if (
    duplicateStore 
  ) {
    return {
      statusCode: httpStatus.CONFLICT,
      message: StoreErrorMessages.DUPLICATE,
    };
  }

  const result = (await storeRepo.findOneAndUpdate(
    _.pick(data, ["_id"]),
    _.omit(data, ["_id"])
  )) as IStore;

  return {
    message: StoreSuccessMessages.UPDATED,
    data: result,
  };
};

export const deleteOneStore = async (
  data: Partial<IStore>
): Promise<IResponseData> => {
  const storeExists = await storeRepo.findOne(_.pick(data, ["_id"]));

  if (!storeExists) {
    return {
      statusCode: httpStatus.NOT_FOUND,
      message: StoreErrorMessages.NOT_FOUND,
    };
  }



  const result = (await storeRepo.findOneAndSoftDelete(
    _.pick(data, ["_id"])
  )) as IStore;

  return {
    message: StoreSuccessMessages.DELETED,
    data: result,
  };
};

export const hardDeleteOneStore = async (
  data: IParamIdDto
): Promise<IResponseData> => {
  const storeExists = await storeRepo.findOneAndHardDelete(data);

  if (!storeExists) {
    return {
      statusCode: httpStatus.NOT_FOUND,
      message: StoreErrorMessages.NOT_FOUND,
    };
  }

  return {};
};
