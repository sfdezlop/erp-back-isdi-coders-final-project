import createDebug from 'debug';
import { Product } from '../entities/product.entity';
import { HTTPError } from '../interfaces/error.js';
import { ProductModel } from './products.mongo.model.js';
const debug = createDebug('ERP:repo:products');

export class ProductsMongoRepo {
  private static instance: ProductsMongoRepo;

  public static getInstance(): ProductsMongoRepo {
    if (!ProductsMongoRepo.instance) {
      ProductsMongoRepo.instance = new ProductsMongoRepo();
    }

    return ProductsMongoRepo.instance;
  }

  private constructor() {
    debug('Instantiated at constructor');
  }

  async getByFilterWithPaginationAndOrder(filter: {
    filterField: string;
    filterValue: string;
    filterSet: number;
    filterRecordsPerSet: number;
    orderField: string;
    orderType: 'asc' | 'desc';
  }): Promise<Product[]> {
    debug('Instantiated at constructor at getByFilterWithPagination method');
    const data = await ProductModel.find({
      [filter.filterField]: filter.filterValue,
    })
      .skip((filter.filterSet - 1) * filter.filterRecordsPerSet)
      .limit(filter.filterRecordsPerSet)
      .sort([[filter.orderField, filter.orderType ? filter.orderType : 'asc']]);

    return data;
  }

  async queryId(id: string): Promise<Product> {
    debug('Instantiated at constructor at queryId method');
    const data = await ProductModel.findById(id);
    if (!data) throw new HTTPError(404, 'Not found', 'Id not found in queryId');
    return data;
  }

  async leftJoinProductMovements(): Promise<unknown[]> {
    debug('Instantiated at constructor at leftJoinProductMovements method');
    const data = await ProductModel.aggregate([
      {
        $lookup: {
          from: 'productmovements',
          localField: 'sku',
          foreignField: 'productSku',
          as: 'resultLeftJoin',
        },
      },
    ]);

    if (!data)
      throw new HTTPError(404, 'Not found', 'Id not found in stockById');
    return data;
  }

  async queryByKey(query: { key: string; value: unknown }): Promise<Product[]> {
    debug('Instantiated at constructor at queryByKey method');
    const data = await ProductModel.find({ [query.key]: query.value });
    if (!data)
      throw new HTTPError(404, 'Not found', 'Value not found in queryByKey');
    return data;
  }

  async create(info: Partial<Product>): Promise<Product> {
    debug('Instantiated at constructor at create method');
    const data = await ProductModel.create(info);
    if (!data)
      throw new HTTPError(
        404,
        'Not possible to create a new record',
        'Not possible to create a new record'
      );
    return data;
  }

  async update(info: Partial<Product>): Promise<Product> {
    debug('Instantiated at constructor at update method');
    const data = await ProductModel.findByIdAndUpdate(info.id, info, {
      new: true,
    });
    if (!data)
      throw new HTTPError(404, 'Record not found', 'Id not found in update');
    return data;
  }

  async deleteById(id: string): Promise<Product> {
    debug(id);
    const data = await ProductModel.findByIdAndDelete(id);
    if (!data)
      throw new HTTPError(
        404,
        'Not found',
        'Delete not possible: id not found'
      );
    return data;
  }

  async deleteByKey(deleteKey: string, deleteValue: string): Promise<Product> {
    // When the key is id, its necessary to indicate _id in the fetch action
    const data = await ProductModel.findByIdAndDelete({
      [deleteKey]: deleteValue,
    });
    if (!data)
      throw new HTTPError(
        404,
        'Not found',
        'Delete not possible: key and value not found'
      );
    return data;
  }

  async countFilteredRecords(query: {
    filterField: string;
    filterValue: string;
  }): Promise<number> {
    debug('Instantiated at constructor at countFilteredRecords method');
    const data = await ProductModel.find({
      [query.filterField]: query.filterValue,
    }).countDocuments();
    return data;
  }

  async groupValuesPerField(field: string): Promise<unknown[]> {
    debug('Instantiated at constructor at groupValuesPerField method');
    const data = await ProductModel.aggregate([
      {
        $group: {
          _id: '$' + field,
          value: {
            $min: '$' + field,
          },
        },
      },
    ]);

    if (!data) throw new HTTPError(404, 'Not found', 'Not found');

    const dataMap = data.map(
      (item: { _id: string; value: string }) => item.value,
      'brand'
    );

    return dataMap;
  }

  async microserviceQueryByKeyValue(
    inputKey: string,
    inputValue: unknown,
    outputKey: string
  ): Promise<object[]> {
    debug('Instantiated at constructor at microserviceQueryByKeyValue method');
    const data = await ProductModel.aggregate([
      {
        $group: {
          _id: '$' + inputKey,
          valueOfKey: {
            $first: '$' + outputKey,
          },
        },
      },
      { $match: { _id: inputValue } },
    ]);

    if (!data)
      throw new HTTPError(
        404,
        'Not found',
        'Value not found in microserviceQueryByKeyValue'
      );
    return data[0].valueOfKey;
  }
}
