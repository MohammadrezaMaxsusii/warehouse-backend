import _ from "lodash";

import { IParamIdDto, IResponseData, ListOptions, RepoFactory } from "../shared";
import { UnitRepository } from "./unit.repository";
import { IUnit } from "./unit.interface";
import httpStatus from "http-status";
import {
  UnitErrorMessages,
  UnitSuccessMessages,
} from "./enums/unit-messages.enum";

const unitRepo = RepoFactory.getRepo<UnitRepository>("unit");

export const createUnit = async (
  data: Partial<IUnit>
): Promise<IResponseData> => {
  const duplicateRole = await unitRepo.findOne({ name: data.name });

  if (duplicateRole) {
    return {
      statusCode: httpStatus.CONFLICT,
      message: UnitErrorMessages.DUPLICATE,
    };
  }

  const result = await unitRepo.create(data);

  return {
    statusCode: httpStatus.CREATED,
    message: UnitSuccessMessages.CREATED,
    data: result,
  };
};

export const findAllUnits = async (
  inputData: Partial<IUnit> & ListOptions
): Promise<IResponseData> => {
  const { data, options } = ListOptions.prepare(inputData);

  const result = await unitRepo.findAll(data, options);

  const count = await unitRepo.countAll(data, options);

  return {
    message: UnitSuccessMessages.LISTED,
    data: result,
    metadata: { totalCount: count },
  };
};

export const findOneUnit = async (
  data: Partial<IUnit>
): Promise<IResponseData> => {
  const result = await unitRepo.findOne(data);

  if (!result) {
    return {
      statusCode: httpStatus.NOT_FOUND,
      message: UnitErrorMessages.NOT_FOUND,
    };
  }

  return {
    message: UnitSuccessMessages.FOUND,
    data: result,
  };
};

export const updateOneUnit = async (
  data: Partial<IUnit>
): Promise<IResponseData> => {
  const unitExist = await unitRepo.findOne(_.pick(data, ["_id"]));

  if (!unitExist) {
    return {
      statusCode: httpStatus.NOT_FOUND,
      message: UnitErrorMessages.NOT_FOUND,
    };
  }

  const duplicateUnit = await unitRepo.findOne({ name: data?.name });

  if (duplicateUnit) {
    return {
      statusCode: httpStatus.CONFLICT,
      message: UnitErrorMessages.DUPLICATE,
    };
  }

  const result = (await unitRepo.findOneAndUpdate(
    _.pick(data, ["_id"]),
    _.omit(data, ["_id"])
  )) as IUnit;

  return {
    message: UnitSuccessMessages.UPDATED,
    data: result,
  };
};

export const deleteOneUnit = async (
  data: Partial<IUnit>
): Promise<IResponseData> => {
  const unitExist = await unitRepo.findOne(_.pick(data, ["_id"]));

  if (!unitExist) {
    return {
      statusCode: httpStatus.NOT_FOUND,
      message: UnitErrorMessages.NOT_FOUND,
    };
  }


  const result = (await unitRepo.findOneAndSoftDelete(
    _.pick(data, ["_id"])
  )) as IUnit;

  return {
    message: UnitSuccessMessages.DELETED,
    data: result,
  };
};

export const hardDeleteOneUnit = async (
  data: IParamIdDto
): Promise<IResponseData> => {
  const unitExist = await unitRepo.findOneAndHardDelete(data);

  if (!unitExist) {
    return {
      statusCode: httpStatus.NOT_FOUND,
      message: UnitErrorMessages.NOT_FOUND,
    };
  }

  return {};
};


