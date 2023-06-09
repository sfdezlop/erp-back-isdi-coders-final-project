import createDebug from 'debug';
import { ProductMovement } from '../entities/productmovement.entity';
import { HTTPError } from '../interfaces/error.js';
import { ProductMovementModel } from './productmovements.mongo.model.js';
import { stringSeparator } from '../config.js';
const debug = createDebug('ERP:repo:productmovements');

export class ProductMovementMongoRepo {
  private static instance: ProductMovementMongoRepo;

  public static getInstance(): ProductMovementMongoRepo {
    if (!ProductMovementMongoRepo.instance) {
      ProductMovementMongoRepo.instance = new ProductMovementMongoRepo();
    }

    return ProductMovementMongoRepo.instance;
  }

  private constructor() {
    debug('Instantiated at constructor');
  }

  async query(): Promise<ProductMovement[]> {
    debug('query method');
    const data = await ProductMovementModel.find().exec();
    return data;
  }

  async queryId(id: string): Promise<ProductMovement> {
    debug('queryId method');
    const data = await ProductMovementModel.findById(id).exec();
    debug('query id');
    if (!data)
      throw new HTTPError(
        444,
        'Id not found in queryId',
        'Id not found in queryId'
      );
    return data;
  }

  async search(query: {
    key: string;
    value: unknown;
  }): Promise<ProductMovement[]> {
    debug('search method');
    const data = await ProductMovementModel.find({
      [query.key]: query.value,
    }).exec();
    return data;
  }

  async create(info: Partial<ProductMovement>): Promise<ProductMovement> {
    debug('create method');
    const data = await ProductMovementModel.create(info);
    return data;
  }

  async deleteById(id: string): Promise<ProductMovement> {
    debug('deleteById method');
    const data = await ProductMovementModel.findByIdAndDelete(id).exec();
    if (!data)
      throw new HTTPError(
        404,
        'Not found',
        'Delete not possible: id not found'
      );

    return data;
  }

  async deleteByKey(
    deleteKey: string,
    deleteValue: string
  ): Promise<ProductMovement> {
    // When the key is id, its necessary to indicate _id in the fetch action
    const data = await ProductMovementModel.findByIdAndDelete({
      [deleteKey]: deleteValue,
    }).exec();
    if (!data)
      throw new HTTPError(
        404,
        'Not found',
        'Delete not possible: key and value not found'
      );
    return data;
  }

  async analytics(): Promise<object> {
    debug('analytics method');

    const dataActualInventoryCost = await ProductMovementModel.aggregate([
      {
        $addFields: {
          unitsXunitaryCost: {
            $multiply: ['$units', '$costPerUnit'],
          },
        },
      },
      {
        $group: {
          _id: 'Total',
          totalValue: {
            $sum: '$unitsXunitaryCost',
          },
        },
      },
      {
        $addFields: {
          total: {
            $substr: ['$_id', 0, 5],
          },
        },
      },
    ]).exec();

    const dataAnnualInventoryCostVariation =
      await ProductMovementModel.aggregate([
        {
          $addFields: {
            yearOfDate: {
              $substr: ['$date', 0, 4],
            },
            unitsXunitaryCost: {
              $multiply: ['$units', '$costPerUnit'],
            },
          },
        },
        {
          $group: {
            _id: '$yearOfDate',
            totalValue: {
              $sum: '$unitsXunitaryCost',
            },
          },
        },
        {
          $addFields: {
            yearOfDate: {
              $substr: ['$_id', 0, 4],
            },
          },
        },
        {
          $sort: {
            yearOfDate: 1,
          },
        },
      ]).exec();

    const dataMonthlyInventoryCostVariation =
      await ProductMovementModel.aggregate([
        {
          $addFields: {
            yearOfDate: {
              $substr: ['$date', 0, 4],
            },
            monthOfDate: {
              $substr: ['$date', 5, 2],
            },
            dayOfDate: {
              $substr: ['$date', 8, 2],
            },
            yearMonthOfDate: {
              $substr: ['$date', 0, 7],
            },
            unitsXunitaryCost: {
              $multiply: ['$units', '$costPerUnit'],
            },
          },
        },
        {
          $group: {
            _id: '$yearMonthOfDate',
            totalValue: {
              $sum: '$unitsXunitaryCost',
            },
          },
        },
        {
          $addFields: {
            yearMonthOfDate: {
              $substr: ['$_id', 0, 7],
            },
          },
        },
        {
          $sort: {
            yearMonthOfDate: 1,
          },
        },
      ]).exec();

    const dataActualStock = await ProductMovementModel.aggregate([
      {
        $group: {
          _id: '$productSku',
          stock: {
            $sum: '$units',
          },
        },
      },
    ]).exec();

    if (
      !dataActualInventoryCost ||
      !dataAnnualInventoryCostVariation ||
      !dataMonthlyInventoryCostVariation ||
      !dataActualStock
    )
      throw new HTTPError(404, 'Not found', 'Analytics Not found');
    return [
      {
        ActualInventoryCost: dataActualInventoryCost,
        AnnualInventoryCostVariation: dataAnnualInventoryCostVariation,
        MonthlyInventoryCostVariation: dataMonthlyInventoryCostVariation,
        ActualStock: dataActualStock,
      },
    ];
  }

  async getByFilterWithPaginationAndOrder(filter: {
    filterField: string;
    filterValue: string;
    filterSet: number;
    filterRecordsPerSet: number;
    orderField: string;
    orderType: 'asc' | 'desc';
  }): Promise<ProductMovement[]> {
    debug('getByFilterWithPagination method');
    const data = await ProductMovementModel.find({
      [filter.filterField]: filter.filterValue,
    })
      .skip((filter.filterSet - 1) * filter.filterRecordsPerSet)
      .limit(filter.filterRecordsPerSet)
      .sort([[filter.orderField, filter.orderType ? filter.orderType : 'asc']])
      .exec();
    return data;
  }

  async countFilteredRecords(query: {
    filterField: string;
    filterValue: string;
  }): Promise<number> {
    debug('countFilteredRecords method');
    const data = await ProductMovementModel.find({
      [query.filterField]: query.filterValue,
    })
      .countDocuments()
      .exec();
    return data;
  }

  async countRecords(): Promise<number> {
    debug('countRecords method');
    const data = await ProductMovementModel.countDocuments().exec();
    return data;
  }

  async stockBySku(sku: string): Promise<{ _id: string; stock: number }[]> {
    debug('stockBySku method');
    const data = await ProductMovementModel.aggregate([
      { $match: { productSku: sku } },
      {
        $group: {
          _id: '$productSku',
          stock: {
            $sum: '$units',
          },
        },
      },
    ]).exec();

    if (!data)
      throw new HTTPError(
        404,
        'sku not found in stockBySku',
        'sku not found in stockBySku'
      );
    return data[0].stock;
  }

  async microserviceStockGroupByKeysFilteredByKeyValue(
    firstGroupByKey: string,
    secondGroupByKey: string,
    filterKey: string,
    filterValue: string
  ): Promise<object[]> {
    debug('microserviceStockGroupByKeysFilteredByKeyValue method');

    const data = await ProductMovementModel.aggregate([
      { $match: { [filterKey]: filterValue } },
      // Use [filterKey] expression instead of $filterKey to force aggregate method to identify filterKey as a parameter, not a property. Place the $match as early in the aggregation pipeline as possible. Because $match limits the total number of documents in the aggregation pipeline, earlier $match operations minimize the amount of later processing. If you place a $match at the very beginning of a pipeline, the query can take advantage of indexes like any other db.collection.find() or db.collection.findOne().

      {
        $project: {
          [firstGroupByKey]: true,
          [secondGroupByKey]: true,
          units: true,
          _id: false,
        },
      },
      {
        $addFields: {
          combinedGroupByKey: {
            $concat: [firstGroupByKey, stringSeparator, secondGroupByKey],
          },
          combinedGroupByValue: {
            $concat: [
              '$' + firstGroupByKey,
              stringSeparator,
              '$' + secondGroupByKey,
            ],
          },
        },
      },
      {
        $group: {
          _id: '$combinedGroupByValue',
          stock: {
            $sum: '$units',
          },
        },
      },
      {
        $addFields: {
          combinedGroupByValueArray: {
            $split: ['$_id', stringSeparator],
          },
        },
      },
      {
        $addFields: {
          [firstGroupByKey]: {
            $arrayElemAt: ['$combinedGroupByValueArray', 0],
          },
        },
      },
      {
        $addFields: {
          [secondGroupByKey]: {
            $arrayElemAt: ['$combinedGroupByValueArray', 1],
          },
        },
      },
      {
        $project: {
          [firstGroupByKey]: true,
          [secondGroupByKey]: true,
          stock: true,
          _id: false,
        },
      },
      {
        $sort: {
          [firstGroupByKey]: 1,
          [secondGroupByKey]: 1,
        },
      },
    ]).exec();

    if (!data)
      throw new HTTPError(
        404,
        'microservice not found',
        'microservice not found'
      );
    return data;
  }

  async stock(): Promise<object[]> {
    debug('stock method');
    const data = await ProductMovementModel.aggregate([
      {
        $group: {
          _id: '$productSku',
          stock: {
            $sum: '$units',
          },
        },
      },
    ]).exec();

    if (!data)
      throw new HTTPError(
        445,
        'collection or field not found',
        'collection or field not found'
      );
    return data;
  }

  async groupValuesPerField(field: string): Promise<unknown[]> {
    debug('Instantiated at constructor at groupValuesPerField method');
    const data = await ProductMovementModel.aggregate([
      {
        $group: {
          _id: '$' + field,
          value: {
            $min: '$' + field,
          },
        },
      },
    ]).exec();

    if (!data) throw new HTTPError(404, 'Not found', 'Not found');

    const dataMap = data.map(
      (item: { _id: string; value: string }) => item.value,
      'type'
    );

    return dataMap;
  }
}
