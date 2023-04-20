import createDebug from 'debug';
import { ProductMovement } from '../entities/productmovement.entity';
import { HTTPError } from '../interfaces/error.js';
import { ProductMovementModel } from './productmovements.mongo.model.js';
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

  async destroy(id: string): Promise<ProductMovement> {
    debug('destroy method');
    const data = await ProductMovementModel.findByIdAndDelete(id).exec();
    if (!data)
      throw new HTTPError(
        404,
        'Not found',
        'Delete not possible: id not found'
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
  }): Promise<ProductMovement[]> {
    debug('getByFilterWithPagination method');
    const data = await ProductMovementModel.find({
      [filter.filterField]: filter.filterValue,
    })
      .skip((filter.filterSet - 1) * filter.filterRecordsPerSet)
      .limit(filter.filterRecordsPerSet)
      .sort(filter.orderField)
      .exec();
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

  async stockBySku(sku: string): Promise<object[]> {
    debug('stockBySku method');
    const data = await ProductMovementModel.aggregate([
      {
        $group: {
          _id: '$productSku',
          stock: {
            $sum: '$units',
          },
        },
      },
      { $match: { _id: sku } },
    ]).exec();

    if (!data)
      throw new HTTPError(
        444,
        'sku not found in stockBySku',
        'sku not found in stockBySku'
      );
    // Debug(data[0].stock);
    return data;
  }

  async stock(): Promise<object[]> {
    debug('stockBySku method');
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
}
