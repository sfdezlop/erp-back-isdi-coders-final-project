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
    debug('Instantiated at constructor at query method');
    const data = await ProductMovementModel.find();
    return data;
  }

  async search(query: {
    key: string;
    value: unknown;
  }): Promise<ProductMovement[]> {
    debug('Instantiated at constructor at search method');
    const data = await ProductMovementModel.find({ [query.key]: query.value });
    return data;
  }

  async create(info: Partial<ProductMovement>): Promise<ProductMovement> {
    debug('Instantiated at constructor at create method');
    const data = await ProductMovementModel.create(info);
    if (!data)
      throw new HTTPError(
        404,
        'Not possible to create a new record',
        'Not possible to create a new record'
      );
    return data;
  }

  async destroy(id: string): Promise<void> {
    debug(id);
    const data = await ProductMovementModel.findByIdAndDelete(id);
    if (!data)
      throw new HTTPError(
        404,
        'Not found',
        'Delete not possible: id not found'
      );
  }

  async countRecords(): Promise<number> {
    debug('Instantiated at constructor at count method');
    const data = await ProductMovementModel.countDocuments();
    return data;
  }

  async analytics(): Promise<object> {
    debug('Instantiated at constructor at analytics method');

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
    ]);

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
      ]);

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
      ]);

    const dataActualStock = await ProductMovementModel.aggregate([
      {
        $group: {
          _id: '$productSku',
          stock: {
            $sum: '$units',
          },
        },
      },
    ]);

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
    debug('Instantiated at constructor at getByFilterWithPagination method');
    const data = await ProductMovementModel.find({
      [filter.filterField]: filter.filterValue,
    })
      .skip((filter.filterSet - 1) * filter.filterRecordsPerSet)
      .limit(filter.filterRecordsPerSet)
      .sort(filter.orderField);
    return data;
  }

  async queryId(id: string): Promise<ProductMovement> {
    debug('Instantiated at constructor at queryId method');
    const data = await ProductMovementModel.findById(id);
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
    debug('Instantiated at constructor at count method');
    const data = await ProductMovementModel.find({
      [query.filterField]: query.filterValue,
    }).countDocuments();
    return data;
  }

  async stockBySku(sku: string): Promise<object[]> {
    debug('Instantiated at constructor at stockBySku method');
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
    ]);

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
    debug('Instantiated at constructor at stockBySku method');
    const data = await ProductMovementModel.aggregate([
      {
        $group: {
          _id: '$productSku',
          stock: {
            $sum: '$units',
          },
        },
      },
    ]);

    if (!data)
      throw new HTTPError(
        445,
        'collection or field not found',
        'collection or field not found'
      );
    return data;
  }
}
