import _, { forEach } from "lodash";

import {
  IParamIdDto,
  IResponseData,
  ListOptions,
  RepoFactory,
} from "../shared";

import httpStatus from "http-status";
import { IForms } from "./forms.interface";
import {
  FormErrorMessages,
  FormSuccessMessages,
} from "./enums/forms-messages.enum";
import { FormsRepository } from "./forms.repository";
import { ICreateFormsFieldsDto } from "./dto/createForm.dto";
import { fileExists } from "../files/functions/file-exists.function";

const FormsRepo = RepoFactory.getRepo<FormsRepository>("forms");

export const createForms = async (
  data: Partial<IForms>
): Promise<IResponseData> => {
  const duplicateRole = await FormsRepo.findOne({ name: data.name });

  if (duplicateRole) {
    return {
      statusCode: httpStatus.CONFLICT,
      message: FormErrorMessages.DUPLICATE,
    };
  }
  for (let item of data?.fields || []) {
    if (item.type == "form") {
      if (!item.relatedForms) {
        return {
          statusCode: httpStatus.CONFLICT,
          message: FormErrorMessages.FORM_NOT_FOUND,
        };
      }
    } else {
      delete item.relatedForms;
    }
  }

  const result = await FormsRepo.create(data);

  return {
    statusCode: httpStatus.CREATED,
    message: FormSuccessMessages.CREATED,
    data: result,
  };
};
export const createFormsFields = async (
  data: ICreateFormsFieldsDto
): Promise<IResponseData> => {
  const result = await FormsRepo.findOne({
    _id: data.formId,
  });

  forEach(data.fields, (field) => {
    if (field.type == "form" && !field.relatedForms) {
      return {
        statusCode: httpStatus.CONFLICT,
        message: FormErrorMessages.FORM_NOT_FOUND,
      };
    }
  });

  // if (result) {
  //   return {
  //     statusCode: httpStatus.CONFLICT,
  //     message: FormErrorMessages.DUPLICATE,
  //   };
  // }
  const fields = await FormsRepo.createFields(data.formId, data);

  return {
    statusCode: httpStatus.CREATED,
    message: FormSuccessMessages.CREATED,
    data: result,
  };
};
export const findAllFormss = async (
  inputData: Partial<IForms> & ListOptions
): Promise<IResponseData> => {
  const { data, options } = ListOptions.prepare(inputData);

  const result = await FormsRepo.findAll(data, options);

  const count = await FormsRepo.countAll(data, options);

  return {
    message: FormSuccessMessages.LISTED,
    data: result,
    metadata: { totalCount: count },
  };
};
export const findOneForms = async (
  data: Partial<IForms>
): Promise<IResponseData> => {
  const result = await FormsRepo.findOne(data);

  if (!result) {
    return {
      statusCode: httpStatus.NOT_FOUND,
      message: FormErrorMessages.NOT_FOUND,
    };
  }

  return {
    message: FormSuccessMessages.FOUND,
    data: result,
  };
};

export const updateOneForms = async (
  data: Partial<IForms>
): Promise<IResponseData> => {
  const FormsExist = await FormsRepo.findOne(_.pick(data, ["_id"]));

  if (!FormsExist) {
    return {
      statusCode: httpStatus.NOT_FOUND,
      message: FormErrorMessages.NOT_FOUND,
    };
  }

  const duplicateForms = await FormsRepo.findOne({ name: data?.name });

  if (duplicateForms) {
    return {
      statusCode: httpStatus.CONFLICT,
      message: FormErrorMessages.DUPLICATE,
    };
  }

  const result = (await FormsRepo.findOneAndUpdate(
    _.pick(data, ["_id"]),
    _.omit(data, ["_id"])
  )) as IForms;

  return {
    message: FormSuccessMessages.UPDATED,
    data: result,
  };
};

export const deleteOneForms = async (
  data: Partial<IForms>
): Promise<IResponseData> => {
  const FormsExist = await FormsRepo.findOne(_.pick(data, ["_id"]));

  if (!FormsExist) {
    return {
      statusCode: httpStatus.NOT_FOUND,
      message: FormErrorMessages.NOT_FOUND,
    };
  }

  const result = (await FormsRepo.findOneAndSoftDelete(
    _.pick(data, ["_id"])
  )) as IForms;

  return {
    message: FormSuccessMessages.DELETED,
    data: result,
  };
};

export const hardDeleteOneForms = async (
  data: IParamIdDto
): Promise<IResponseData> => {
  const FormsExist = await FormsRepo.findOneAndHardDelete(data);

  if (!FormsExist) {
    return {
      statusCode: httpStatus.NOT_FOUND,
      message: FormErrorMessages.NOT_FOUND,
    };
  }

  return {};
};
