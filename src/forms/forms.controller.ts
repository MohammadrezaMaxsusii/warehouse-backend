import { Router } from "express";
import { Authentication, Authorization, DataValidator, ParamIdDto, ResponseFormatter } from "../shared";
import { FormsPermissionsEnum } from "./enums/forms-permissions.enum";
import { CreateFormssDto } from "./dto/createForm.dto";
import { FindFormsListDto } from "./dto/find-froms-list.dto";
import { UpdateFormsDto } from "./dto/update-froms.dto";
import { createForms, createFormsFields, deleteOneForms, findAllFormss, findOneForms, hardDeleteOneForms, updateOneForms } from "./froms.service";


const router = Router();

// Create new Forms
router.post(
  "/create",
  Authentication,
  Authorization(FormsPermissionsEnum.CREATE),
  CreateFormssDto,
  DataValidator,
  ResponseFormatter(createForms)
);

router.post(
  "/create-fields",
  Authentication,
  Authorization(FormsPermissionsEnum.CREATE),
  CreateFormssDto,
  DataValidator,
  ResponseFormatter(createFormsFields)
)

// Find Formss list
router.get(
  "/list",
  Authentication,
  Authorization(FormsPermissionsEnum.LIST),
  FindFormsListDto,
  DataValidator,
  ResponseFormatter(findAllFormss)
);

// Find specific Forms
router.get(
  "/byId/:id",
  Authentication,
  Authorization(FormsPermissionsEnum.FIND_ONE),
  ParamIdDto,
  DataValidator,
  ResponseFormatter(findOneForms)
);

// Update specific Forms
router.patch(
  "/update/:id",
  Authentication,
  Authorization(FormsPermissionsEnum.UPDATE),
  UpdateFormsDto,
  DataValidator,
  ResponseFormatter(updateOneForms)
);

// Delete specific Forms
router.delete(
  "/delete/:id",
  Authentication,
  Authorization(FormsPermissionsEnum.DELETE),
  ParamIdDto,
  DataValidator,
  ResponseFormatter(deleteOneForms)
);

// Hard Delete specific Forms
router.delete(
  "/delete/hard/:id",
  Authentication,
  Authorization(FormsPermissionsEnum.HARD_DELETE),
  ParamIdDto,
  DataValidator,
  ResponseFormatter(hardDeleteOneForms)
);
export default router;
