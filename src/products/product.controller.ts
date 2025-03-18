import { Router } from "express";
import { ResponseFormatter } from "../shared/middlewares/response-formatter.middelware";
import { ParamIdDto } from "../shared/dtos/requests/param-id.dto";
import { DataValidator } from "../shared/middlewares/data-validator.middleware";
import { Authentication } from "../shared/middlewares/authentication.middleware";
import { Authorization } from "../shared/middlewares/authorization.middleware";
import {
  createProduct,
  deleteOneProduct,
  findAllProducts,
  findOneProduct,
  hardDeleteOneProduct,
  updateOneProduct,
} from "./product.service";
import { ProductPermissionsEnum } from "./enums/product-permissions.enum";
import { CreateProductDto } from "./dto/create-product.dto";
import { FindProductsListDto } from "./dto/find-product-list.dto";
import { UpdateProductDto } from "./dto/update-product.dto";

const router = Router();

// Create new Product
router.post(
  "/create",
  Authentication,
  Authorization(ProductPermissionsEnum.CREATE),
  CreateProductDto,
  DataValidator,
  ResponseFormatter(createProduct)
);

// Find Products list
router.get(
  "/list",
  Authentication,
  Authorization(ProductPermissionsEnum.LIST),
  FindProductsListDto,
  DataValidator,
  ResponseFormatter(findAllProducts)
);

// Find specific Product
router.get(
  "/byId/:id",
  Authentication,
  Authorization(ProductPermissionsEnum.FIND_ONE),
  ParamIdDto,
  DataValidator,
  ResponseFormatter(findOneProduct)
);

// Update specific Product
router.patch(
  "/update/:id",
  Authentication,
  Authorization(ProductPermissionsEnum.UPDATE),
  UpdateProductDto,
  DataValidator,
  ResponseFormatter(updateOneProduct)
);

// Delete specific Product
router.delete(
  "/delete/:id",
  Authentication,
  Authorization(ProductPermissionsEnum.DELETE),
  ParamIdDto,
  DataValidator,
  ResponseFormatter(deleteOneProduct)
);

// Hard Delete specific Product
router.delete(
  "/delete/hard/:id",
  Authentication,
  Authorization(ProductPermissionsEnum.HARD_DELETE),
  ParamIdDto,
  DataValidator,
  ResponseFormatter(hardDeleteOneProduct)
);

export default router;
