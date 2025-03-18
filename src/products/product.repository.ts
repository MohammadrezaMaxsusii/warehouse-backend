import { Model } from "mongoose";
import { BaseRepository } from "../shared";
import { IProduct } from "./products.interface";

export class ProductRepository extends BaseRepository<IProduct> {
  constructor(private readonly ProductModel: Model<IProduct>) {
    super(ProductModel);
  }
}
