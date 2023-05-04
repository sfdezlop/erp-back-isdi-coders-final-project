import createDebug from 'debug';
import { UserModel } from './users.mongo.model.js';
import { ProductModel } from './products.mongo.model.js';
import { ProductMovementModel } from './productmovements.mongo.model.js';
import { Collection, Model } from 'mongoose';
import { HTTPError } from '../interfaces/error.js';

const debug = createDebug('ERP:repo:collections');

export class CollectionsMongoRepo {
  private static instance: CollectionsMongoRepo;

  public static getInstance(): CollectionsMongoRepo {
    if (!CollectionsMongoRepo.instance) {
      CollectionsMongoRepo.instance = new CollectionsMongoRepo();
    }

    return CollectionsMongoRepo.instance;
  }

  private constructor() {
    debug('Instantiated at constructor');
  }

  async read(encodedQuery: string): Promise<Collection[]> {
    debug('Instantiated at constructor at read method');
    const decodedQuery = decodeURI(encodedQuery);

    const collection = decodedQuery
      .split('&collection=')[1]
      .split('&filterfield=')[0];
    const filterField = decodedQuery
      .split('&filterfield=')[1]
      .split('&filtervalue=')[0];
    const filterValue = decodedQuery
      .split('&filtervalue=')[1]
      .split('&searchfield=')[0];
    const searchField = decodedQuery
      .split('&searchfield=')[1]
      .split('&searchvalue=')[0];
    const searchValue = decodedQuery
      .split('&searchvalue=')[1]
      .split('&searchtype=')[0];
    const searchType = decodedQuery
      .split('&searchtype=')[1]
      .split('&queryset=')[0];
    const querySet = Number(
      decodedQuery.split('&queryset=')[1].split('&queryrecordsperset=')[0]
    );
    const queryRecordsPerSet = Number(
      decodedQuery.split('&queryrecordsperset=')[1].split('&orderfield=')[0]
    );
    const orderField = decodedQuery
      .split('&orderfield=')[1]
      .split('&ordertype=')[0];
    const orderType = decodedQuery.split('&ordertype=')[1];

    let CollectionModel: typeof Model;

    switch (collection) {
      case 'products':
        CollectionModel = ProductModel;
        break;
      case 'productmovements':
        CollectionModel = ProductMovementModel;
        break;
      default:
        CollectionModel = UserModel;
    }

    let searchValueRegexPattern = new RegExp(`${searchValue}`); // Contains
    switch (searchType) {
      case 'Begins with':
        searchValueRegexPattern = new RegExp(`^${searchValue}`);
        break;
      case 'Ends with':
        searchValueRegexPattern = new RegExp(`${searchValue}$`);
        break;
      case 'Exact match':
        searchValueRegexPattern = new RegExp(`^${searchValue}$`);
        break;
      default:
        searchValueRegexPattern = new RegExp(`${searchValue}`);
    }

    const filterValueObjectPattern =
      filterValue === ''
        ? {}
        : {
            [filterField]: filterValue,
          };

    const data: Collection[] = await CollectionModel.find({
      [searchField]: { $regex: searchValueRegexPattern },
    })
      .find(filterValueObjectPattern)
      .skip((querySet - 1) * queryRecordsPerSet)
      .limit(queryRecordsPerSet)
      .sort([[orderField, orderType === 'asc' ? 'asc' : 'desc']])
      .exec();

    if (!data)
      throw new HTTPError(
        404,
        'Impossible to read at collection' + collection,
        'Impossible to read at collection' + collection
      );
    return data;
  }

  async groupBy(encodedQuery: string) {
    debug('Instantiated at constructor at groupBy method');
    const decodedQuery = decodeURI(encodedQuery);

    const collection = decodedQuery
      .split('&collection=')[1]
      .split('&firstgroupbyfield=')[0];
    const firstGroupByField = decodedQuery
      .split('&firstgroupbyfield=')[1]
      .split('&secondgroupbyfield=')[0];
    const secondGroupByField = decodedQuery
      .split('&secondgroupbyfield=')[1]
      .split('&searchfield=')[0];
    const searchField = decodedQuery
      .split('&searchfield=')[1]
      .split('&searchvalue=')[0];

    const searchValue = decodedQuery
      .split('&searchvalue=')[1]
      .split('&searchtype=')[0];
    const searchType = decodedQuery
      .split('&searchtype=')[1]
      .split('&aggregatesumfield=')[0];
    const aggregateSumField = decodedQuery.split('&aggregatesumfield=')[1];
    let CollectionModel: typeof Model;

    switch (collection) {
      case 'products':
        CollectionModel = ProductModel;
        break;
      case 'productmovements':
        CollectionModel = ProductMovementModel;
        break;
      default:
        CollectionModel = UserModel;
    }

    let searchValueRegexPattern = new RegExp(`${searchValue}`); // Contains
    switch (searchType) {
      case 'Begins with':
        searchValueRegexPattern = new RegExp(`^${searchValue}`);
        break;
      case 'Ends with':
        searchValueRegexPattern = new RegExp(`${searchValue}$`);
        break;
      case 'Exact match':
        searchValueRegexPattern = new RegExp(`^${searchValue}$`);
        break;
      default:
        searchValueRegexPattern = new RegExp(`${searchValue}`);
    }

    let data: { documents: number; aggregateSumValue: number }[] =
      await CollectionModel.aggregate([
        { $match: { [searchField]: { $regex: searchValueRegexPattern } } },

        // Use [searchKey] expression instead of $searchKey to force aggregate method to identify searchKey as a parameter, not a property.
        // Place the $match as early in the aggregation pipeline as possible. Because $match limits the total number of documents in the aggregation pipeline, earlier $match operations minimize the amount of later processing. If you place a $match at the very beginning of a pipeline, the query can take advantage of indexes like any other db.collection.find() or db.collection.findOne().

        {
          $addFields: {
            fakeFieldForCountingDocuments: 1,
          },
        },
        {
          $project: {
            _id: false,
            [firstGroupByField]: true,
            [secondGroupByField]: true,
            [aggregateSumField]: true,
            fakeFieldForCountingDocuments: true,
          },
        },
        {
          $addFields: {
            combinedGroupByField: {
              $concat: [firstGroupByField, '_-_', secondGroupByField],
            },
            combinedGroupByValue: {
              $concat: [
                '$' + firstGroupByField,
                '_-_',
                '$' + secondGroupByField,
              ],
            },
          },
        },
        {
          $group: {
            _id: '$combinedGroupByValue',
            documents: {
              $sum: '$fakeFieldForCountingDocuments',
            },
            aggregateSumValue: {
              $sum: '$' + aggregateSumField,
            },
          },
        },

        {
          $addFields: {
            combinedGroupByValueArray: {
              $split: ['$_id', '_-_'],
            },
          },
        },
        {
          $addFields: {
            [firstGroupByField]: {
              $arrayElemAt: ['$combinedGroupByValueArray', 0],
            },
          },
        },
        {
          $addFields: {
            [secondGroupByField]: {
              $arrayElemAt: ['$combinedGroupByValueArray', 1],
            },
          },
        },
        {
          $project: {
            [firstGroupByField]: true,
            [secondGroupByField]: true,
            aggregateSumValue: true,
            documents: true,
            _id: false,
          },
        },
        {
          $sort: {
            [firstGroupByField]: 1,
            [secondGroupByField]: 1,
          },
        },
      ]).exec();

    if (!data)
      throw new HTTPError(
        404,
        'Impossible to groupBy at collection' + collection,
        'Impossible to groupBy at collection' + collection
      );

    if (data.length === 0) data = [{ documents: 0, aggregateSumValue: 0 }];

    // Defensive result when there is no groupBy results
    return data;
  }
}
