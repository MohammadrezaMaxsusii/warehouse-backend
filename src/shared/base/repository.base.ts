import mongoose, {
  FilterQuery,
  Model,
  ProjectionFields,
  QueryOptions,
  Types,
  UpdateQuery,
} from "mongoose";
import { ListOptions } from "../dtos/requests/list-options.dto";
import { addSortDto } from "../dtos/requests/add-sort.dto";
import { addLimitDto } from "../dtos/requests/add-limit.dto";
import { addPaginationDto } from "../dtos/requests/add-pagination.dto";
import _, { omit, pick, StringIterator } from "lodash";

export default class BaseRepository<T> {
  constructor(protected readonly model: Model<T>) {}

  async create(data: Partial<T>): Promise<T> {
    return (await this.model.create(data)).toJSON() as T;
  }

  protected timeQueryHandler({ from, to }: { from?: number; to?: number }) {
    let timeFilterQuery: { createdAt?: { $gte?: number; $lte?: number } } = {};

    if (from) {
      if (!timeFilterQuery.createdAt) timeFilterQuery.createdAt = {};

      timeFilterQuery.createdAt = { $gte: Number(from) };
    }

    if (to) {
      if (!timeFilterQuery.createdAt) timeFilterQuery.createdAt = {};

      timeFilterQuery.createdAt = { $lte: Number(from) };
    }

    return timeFilterQuery;
  }

  protected getStringModelProperties(): string[] {
    let paths = this.model.schema.paths;

    let fields: string[] = [];

    for (let key in paths) {
      if (paths[key].instance !== "String") continue;

      fields.push(key);
    }

    return fields;
  }
  protected searchQueryHandler({ search }: { search?: string }) {
    let searchQuery = {};
    if (search) {
      const regQueries = [];
      const paths = this.model.schema.paths;

      // Check if the search input is a potential ObjectId or UUID
      const isObjectId = mongoose.Types.ObjectId.isValid(search);
      const isUUID =
        /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
          search
        );

      for (let key in paths) {
        const pathType = paths[key].instance;

        if (isObjectId && pathType === "ObjectID") {
          // Exact match search for ObjectId
          regQueries.push({ [key]: search });
        } else if (isUUID && pathType === "UUID") {
          // Exact match search for UUIDs stored as strings
          regQueries.push({ [key]: search });
        } else if (!isObjectId && !isUUID && pathType === "String") {
          // Flexible regex search for regular string fields
          const words = search
            .trim()
            .split(/\s+/)
            .flatMap((word) => {
              const match = word.match(/^(\D+)(\d+)$/);
              return match ? [match[1], match[2]] : [word];
            });
          const regexPattern = words
            .map((word) => `(${word})`)
            .join("[\\s\\-_]*");
          const regex = new RegExp(regexPattern, "i");
          regQueries.push({ [key]: { $regex: regex } });
        }
      }

      if (regQueries.length) {
        searchQuery = { $or: regQueries };
      }
    }

    return searchQuery;
  }

  async findAll(
    data: FilterQuery<T>,
    ListOptions?: ListOptions,
    projection: ProjectionFields<T> = {}
  ): Promise<T[]> {
    const { sort, limit, skip } = this.addListOptions(ListOptions || {});

    let {
      from,
      to,
      search: rawSearch,
    } = pick(ListOptions, ["from", "to", "search"]);

    // ##############################################################
    // apply search on string fields

    const search = rawSearch ? String(rawSearch) : undefined;

    let searchQuery: any = this.searchQueryHandler({
      search: search,
    });

    // ##############################################################
    // apply search with time

    let timeFilterQuery: any = this.timeQueryHandler({ from, to });

    // ##############################################################
    // apply converting search on specific string field to regex

    data = this.applyRegexToStringSearch(omit(data, ["from", "to", "search"]));

    // ##############################################################
    // query on db
    return this.model.find(
      {
        ...data,
        deletedAt: null,
        ...timeFilterQuery,
        ...searchQuery,
      },
      projection,
      {
        sort,
        limit,
        skip,
      }
    );
  }

  async countAll(
    data: FilterQuery<T>,
    ListOptions?: ListOptions
  ): Promise<number> {
    let {
      from,
      to,
      search: rawSearch,
    } = pick(ListOptions, ["from", "to", "search"]);

    // ##############################################################
    // apply search on string fields

    const search = rawSearch ? String(rawSearch) : undefined;

    let searchQuery: any = this.searchQueryHandler({
      search: search,
    });

    // ##############################################################
    // apply search with time

    let timeFilterQuery: any = this.timeQueryHandler({ from, to });

    // ##############################################################
    // apply converting search on specific string field to regex

    data = this.applyRegexToStringSearch(omit(data, ["from", "to", "search"]));

    // ##############################################################
    // query on db
    return this.model.countDocuments({
      ...data,
      deletedAt: null,
      ...timeFilterQuery,
      ...searchQuery,
    });
  }

  async findOne(
    data: FilterQuery<T>,
    projectionFields?: ProjectionFields<T>,
    queryOptions?: QueryOptions<T>
  ): Promise<T | null> {
    const result = await this.model.findOne(
      { ...data, deletedAt: null },
      { ...projectionFields },
      { ...queryOptions }
    );

    if (result) {
      return result;
    } else {
      return null;
    }
    // .lean<T>(true);
  }

  async findOneAndUpdate(
    findData: FilterQuery<T>,
    updateData: UpdateQuery<T>,
    queryOptions?: QueryOptions<T>
  ): Promise<T | null> {
    return this.model.findOneAndUpdate(
      { ...findData, deletedAt: null },
      updateData,
      {
        new: true,
        ...queryOptions,
      }
    );
    // .lean<T>(true);
  }

  async findAllAndUpdate(
    findData: FilterQuery<T>,
    updateData: UpdateQuery<T>
  ): Promise<undefined> {
    await this.model.updateMany({ ...findData, deletedAt: null }, updateData, {
      new: true,
    });
    // .lean<T>(true);
  }

  async findOneAndSoftDelete(findData: FilterQuery<T>): Promise<T | null> {
    return this.model.findOneAndUpdate(
      { ...findData, deletedAt: null },
      { deletedAt: Date.now() },
      { new: true }
    );
    // .lean<T>(true);
  }

  async upsert(
    findData: FilterQuery<T>,
    updateData: UpdateQuery<T>
  ): Promise<T | null> {
    return this.model.findOneAndUpdate(
      { ...findData, deletedAt: null },
      updateData,
      { upsert: true }
    );
  }

  async findOneAndHardDelete(findData: FilterQuery<T>): Promise<T | null> {
    return await this.model.findOneAndDelete(findData);
  }

  async distinct(
    distinctPath: string,
    filterQuery: FilterQuery<T>
  ): Promise<any[]> {
    return await this.model.distinct(distinctPath, {
      ...filterQuery,
      deletedAt: null,
    });
  }

  public addSort(data: addSortDto) {
    const { sort, asc } = data;

    let obj: Record<string, number> = {};

    let key: string;
    let value: 1 | -1;

    if (sort) key = sort;
    else key = "createdAt";

    if (asc === false || (asc as unknown as string) === "false") {
      value = -1;
    } else value = 1;

    obj[key] = value;

    return obj;
  }

  protected addLimit(data: addLimitDto) {
    const { limit } = data;

    return limit || 200;
  }

  protected addPagination(data: addPaginationDto) {
    const { page } = data;

    return page || 1;
  }

  protected addListOptions(data: ListOptions) {
    data = data ?? {};

    const sort = this.addSort(_.pick(data, ["sort", "asc"]));
    const limit = this.addLimit(_.pick(data, ["limit"]));
    const page = this.addPagination(_.pick(data, ["page"]));
    const skip = (page - 1) * limit;
    // const search = this.addSearch(_.pick(data, ["searchKey", "searchValue"]));

    return {
      sort,
      limit,
      skip,
      // search,
    };
  }

  protected applyRegexToStringSearch(data: Record<string, unknown>): any {
    let dataCopy = JSON.parse(JSON.stringify(data));
    let stringFields = this.getStringModelProperties();

    for (let [key, value] of Object.entries(dataCopy)) {
      if (stringFields.includes(key) && !mongoose.isValidObjectId(value)) {
        dataCopy[key] = { $regex: value };
      } else if (isNaN(Number(value)) && mongoose.isValidObjectId(value)) {
        dataCopy[key] = new Types.ObjectId(value as string);
      } else if (!isNaN(Number(value))) {
        dataCopy[key] = Number(value);
      }
    }

    return dataCopy;
  }

  // protected search;
}
