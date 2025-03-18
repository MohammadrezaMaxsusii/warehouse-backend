import { NextFunction, Request, Response } from "express";
import { IResponseData } from "../interfaces/response-data.interface";
import httpStatus from "http-status";
import {
  SharedErrorMessages,
  SharedSuccessMessages,
} from "../enums/shared-messages.enum";
import { incomingDataCollector } from "../utils/functions/incoming-data-collector.function";
import { RequestWithPayload } from "../interfaces/request-with-payload.interface";
import { responseDataModifier } from "../utils/functions/change-response-data.function";
import { Readable } from "stream";
import { IResponseDataForFiles } from "../interfaces/response-data-for-file.interface";
import { ILogger } from "../../logger/interfaces/logger.interface";
import { RepoFactory } from "../repoFactory";
import { LoggerRepository } from "../../logger/logger.repository";

const loggerRepo = RepoFactory.getRepo<LoggerRepository>("logger");

export function ResponseFormatter(fn: any) {
  return async (req: RequestWithPayload, res: Response, next: NextFunction) => {
    const requestData = incomingDataCollector(req);
    const payload = req?.payload;

    const reqStartTime = new Date().getTime();
    const logger: Partial<ILogger> = {};

    let responseObject: IResponseData;
    try {
      const fnResult: IResponseData = await fn?.apply({}, [
        requestData,
        payload,
        req,
      ]);

      if (!fnResult.statusCode) {
        fnResult.statusCode = 200;
      }

      if (!fnResult.message) {
        fnResult.message = SharedSuccessMessages.SUCCESS;
      }

      if (!fnResult.data) {
        fnResult.data = {};
      }

      if (fnResult.statusCode >= 400) {
        fnResult.error = true;
        // fnResult.data = {};
      }

      responseObject = fnResult;
    } catch (error) {
      console.error(error);
      logger.error = (error as Error).stack as string;
      responseObject = {
        error: true,
        message: SharedErrorMessages.INTERNAL_SERVER_ERROR,
        statusCode: httpStatus.INTERNAL_SERVER_ERROR,
        data: {},
      };
    }

    logger.reqData = requestData;
    logger.resData = responseDataModifier(
      JSON.parse(JSON.stringify(responseObject.data))
    );
    logger.status = responseObject.statusCode;
    logger.duration = new Date().getTime() - reqStartTime;
    logger.api = req.originalUrl;
    logger.method = req.method;
    logger.entity = req.originalUrl.split("/").slice(1, 2)[0];

    if (!responseObject.isFile) {
      loggerRepo.create(logger);

      let deepCopyData = JSON.parse(JSON.stringify(responseObject.data));
      responseObject.data = responseDataModifier(deepCopyData);

      return res
        .status(responseObject?.statusCode as number)
        .json(responseObject);
    } else {
      res.set({
        "Content-Disposition": `inline; filename="${responseObject.data.name}"`,
        "Content-Type": responseObject.data.type,
      });

      (
        (responseObject as IResponseDataForFiles).readableStream as Readable
      ).pipe(res);
    }
  };
}
