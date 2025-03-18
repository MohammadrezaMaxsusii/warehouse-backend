import { Router } from "express";
import { ResponseFormatter } from "../shared/middlewares/response-formatter.middelware";
import { ParamIdDto } from "../shared/dtos/requests/param-id.dto";
import { DataValidator } from "../shared/middlewares/data-validator.middleware";
import { Authentication } from "../shared/middlewares/authentication.middleware";
import { Authorization } from "../shared/middlewares/authorization.middleware";
import { createStore, deleteOneStore, findAllStores, findOneStore, hardDeleteOneStore, updateOneStore } from "./store.service";
import { CreateStoreDto } from "./dto/create-store.dto";
import { storePermissionsEnum } from "./enums/store-permissions.enum";
import { FindStoresListDto } from "./dto/find-store-list.dto";
import { UpdateStoreDto } from "./dto/update-store.dto";

const router = Router();

// Create new store
router.post(
  "/create",
  Authentication,
  Authorization(storePermissionsEnum.CREATE),
  CreateStoreDto,
  DataValidator,
  ResponseFormatter(createStore)
);

// Find stores list
router.get(
  "/list",
  Authentication,
  Authorization(storePermissionsEnum.LIST),
  FindStoresListDto,
  DataValidator,
  ResponseFormatter(findAllStores)
);

// Find specific store
router.get(
  "/byId/:id",
  Authentication,
  Authorization(storePermissionsEnum.FIND_ONE),
  ParamIdDto,
  DataValidator,
  ResponseFormatter(findOneStore)
);

// Update specific store
router.patch(
  "/update/:id",
  Authentication,
  Authorization(storePermissionsEnum.UPDATE),
  UpdateStoreDto,
  DataValidator,
  ResponseFormatter(updateOneStore)
);

// Delete specific store
router.delete(
  "/delete/:id",
  Authentication,
  Authorization(storePermissionsEnum.DELETE),
  ParamIdDto,
  DataValidator,
  ResponseFormatter(deleteOneStore)
);

// Hard Delete specific store
router.delete(
  "/delete/hard/:id",
  Authentication,
  Authorization(storePermissionsEnum.HARD_DELETE),
  ParamIdDto,
  DataValidator,
  ResponseFormatter(hardDeleteOneStore)
);



export default router;
