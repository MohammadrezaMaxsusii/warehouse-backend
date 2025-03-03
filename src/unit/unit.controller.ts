import { Router } from "express";
import { Authentication, Authorization, DataValidator, ParamIdDto, ResponseFormatter } from "../shared";
import { CreateUnitDto } from "./dto/create-unit.dto";
import { createUnit, deleteOneUnit, findAllUnits, findOneUnit, hardDeleteOneUnit, updateOneUnit } from "./unit.service";
import { UnitPermissionsEnum } from "./enums/unit-permissions.enum";
import { UpdateUnitDto } from "./dto/update-units.dto";
import { FindUnitsListDto } from "./dto/find-units-list.dto";

const router = Router();

// Create new unit
router.post(
  "/create",
  Authentication,
  Authorization(UnitPermissionsEnum.CREATE),
  CreateUnitDto,
  DataValidator,
  ResponseFormatter(createUnit)
);

// Find units list
router.get(
  "/list",
  Authentication,
  Authorization(UnitPermissionsEnum.LIST),
  FindUnitsListDto,
  DataValidator,
  ResponseFormatter(findAllUnits)
);

// Find specific unit
router.get(
  "/byId/:id",
  Authentication,
  Authorization(UnitPermissionsEnum.FIND_ONE),
  ParamIdDto,
  DataValidator,
  ResponseFormatter(findOneUnit)
);

// Update specific unit
router.patch(
  "/update/:id",
  Authentication,
  Authorization(UnitPermissionsEnum.UPDATE),
  UpdateUnitDto,
  DataValidator,
  ResponseFormatter(updateOneUnit)
);

// Delete specific unit
router.delete(
  "/delete/:id",
  Authentication,
  Authorization(UnitPermissionsEnum.DELETE),
  ParamIdDto,
  DataValidator,
  ResponseFormatter(deleteOneUnit)
);

// Hard Delete specific unit
router.delete(
  "/delete/hard/:id",
  Authentication,
  Authorization(UnitPermissionsEnum.HARD_DELETE),
  ParamIdDto,
  DataValidator,
  ResponseFormatter(hardDeleteOneUnit)
);


export default router;
