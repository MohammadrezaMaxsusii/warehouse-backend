import { NextFunction, Request, Response, Router } from "express";
import { Authentication } from "../shared/middlewares/authentication.middleware";
import { Authorization } from "../shared/middlewares/authorization.middleware";
import { ResponseFormatter } from "../shared/middlewares/response-formatter.middelware";
import { deleteFile, getFile, uploadFile } from "./file.service";
import fileUpload from "express-fileupload";
import { uploadFileDto } from "./dto/upload-file.dto";
import { DataValidator } from "../shared/middlewares/data-validator.middleware";
import { ParamIdDto } from "../shared/dtos/requests/param-id.dto";
import { filePermissionsEnum } from "./enums/file-permission.enum";

const router = Router();

// Upload new file
router.post(
  "/upload",
  Authentication,
  Authorization(filePermissionsEnum.UPLOAD),
  fileUpload(),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = { ...(req.files as any).files };
    next();
  },
  uploadFileDto,
  DataValidator,
  ResponseFormatter(uploadFile)
);

// Upload new file
router.delete(
  "/delete/:id",
  Authentication,
  Authorization(filePermissionsEnum.DELETE),
  ParamIdDto,
  DataValidator,
  ResponseFormatter(deleteFile)
);

router.get(
  "/byId/:id",
  // Authentication,
  // Authorization(filePermissionsEnum.GET),
  ParamIdDto,
  DataValidator,
  ResponseFormatter(getFile)
);

export default router;
