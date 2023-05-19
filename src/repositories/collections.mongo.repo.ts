import createDebug from 'debug';
import { AppCollectionFieldModel } from './appcollectionfields.mongo.model.js';
import { BrandModel } from './brands.mongo.model.js';
import { ProductMovementModel } from './productmovements.mongo.model.js';
import { ProductModel } from './products.mongo.model.js';
import { UserModel } from './users.mongo.model.js';
import mongoose, { Model } from 'mongoose';
import { HTTPError } from '../interfaces/error.js';

import { stringSeparator } from '../config.js';
// Import { Collection } from '../entities/collection.entity.js';
import { TranslationModel } from './translations.mongo.model.js';

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

  async readRecords(encodedQuery: string) {
    debug('readRecords-method');
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
    const orderType = decodedQuery
      .split('&ordertype=')[1]
      .split('&controlinfo=')[0];

    let CollectionModel: typeof Model;

    switch (collection) {
      case 'appcollectionfields':
        CollectionModel = AppCollectionFieldModel;
        break;
      case 'brands':
        CollectionModel = BrandModel;
        break;
      case 'productmovements':
        CollectionModel = ProductMovementModel;
        break;
      case 'products':
        CollectionModel = ProductModel;
        break;
      case 'translations':
        CollectionModel = TranslationModel;
        break;
      case 'users':
        CollectionModel = UserModel;
        break;
      default:
        CollectionModel = UserModel;
    }

    let searchValueRegexPattern: RegExp; // Contains
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
      case 'Contains':
        searchValueRegexPattern = new RegExp(`${searchValue}`);
        break;
      default:
        // eslint-disable-next-line prefer-regex-literals
        searchValueRegexPattern = new RegExp(`.*.`);
    }

    const filterValueObjectPattern =
      filterValue === ''
        ? {}
        : filterField === 'id' || filterField === '_id'
        ? {
            _id: new mongoose.Types.ObjectId(filterValue),
          }
        : {
            [filterField]: filterValue,
          };

    const searchObjectPattern =
      searchField === 'id' || searchField === '_id'
        ? { _id: new mongoose.Types.ObjectId(searchValue) }
        : {
            [searchField]: { $regex: searchValueRegexPattern },
          };

    // Mongoose find method does not work passing arguments string or regexp for field id because ObjectID is stored as 12 binary bytes but strings and regex are 24-byte string

    const data = await CollectionModel.find({
      $and: [filterValueObjectPattern, searchObjectPattern],
    })

      .skip((querySet - 1) * queryRecordsPerSet)
      .limit(queryRecordsPerSet)
      .sort([[orderField, orderType === 'asc' ? 'asc' : 'desc']]);
    if (!data)
      throw new HTTPError(
        404,
        'Impossible to read at collection' + collection,
        'Impossible to read at collection' + collection
      );

    return data;
  }

  async readRecordFieldValue(encodedQuery: string): Promise<unknown[]> {
    debug('readRecordFieldValue-method');

    const decodedQuery = decodeURI(encodedQuery);

    const collection = decodedQuery
      .split('&collection=')[1]
      .split('&searchfield=')[0];

    const searchField = decodedQuery
      .split('&searchfield=')[1]
      .split('&searchvalue=')[0];

    const searchValue = decodedQuery
      .split('&searchvalue=')[1]
      .split('&outputfieldname=')[0];
    const outputFieldName = decodedQuery
      .split('&outputfieldname=')[1]
      .split('&controlinfo=')[0];

    let CollectionModel: typeof Model;

    switch (collection) {
      case 'appcollectionfields':
        CollectionModel = AppCollectionFieldModel;
        break;
      case 'brands':
        CollectionModel = BrandModel;
        break;
      case 'productmovements':
        CollectionModel = ProductMovementModel;
        break;
      case 'products':
        CollectionModel = ProductModel;
        break;
      case 'translations':
        CollectionModel = TranslationModel;
        break;
      case 'users':
        CollectionModel = UserModel;
        break;
      default:
        CollectionModel = UserModel;
    }

    const matchObjectPattern =
      searchField === 'id' || searchField === '_id'
        ? { _id: new mongoose.Types.ObjectId(searchValue) }
        : {
            [searchField]: searchValue,
          };
    // $match does not work for field id because ObjectID is stored as 12 binary bytes and regex is a 24-byte string. See https://stackoverflow.com/questions/36193289/moongoose-aggregate-match-does-not-match-ids

    let data = await CollectionModel.aggregate([
      { $match: matchObjectPattern },

      {
        $addFields: {
          inputCollection: collection,
          inputFieldName: searchField,
          inputFieldValue: searchValue,
          outputFieldName,
          outputFieldValue: '$' + outputFieldName,
          outputStatus: 'ok',
        },
      },
      {
        $project: {
          inputCollection: true,
          inputFieldName: true,
          inputFieldValue: true,
          outputFieldName: true,
          outputFieldValue: true,
          outputStatus: true,
          _id: true,
          id: true,
        },
      },
    ]);

    if (!data)
      throw new HTTPError(
        404,
        'Impossible to readRecordFieldValue at collection' + collection,
        'Impossible to readRecordFieldValue at collection' + collection
      );

    if (data.length === 0) {
      data = [
        {
          inputCollection: collection,
          inputFieldName: searchField,
          inputFieldValue: searchValue,
          outputFieldName,
          outputFieldValue: 'not found',
          outputStatus: 'ko',
        },
      ];
    }

    // Defensive result when there is no groupBy results

    return data;
  }

  async groupBy(encodedQuery: string) {
    debug('groupBy-method');
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
    const aggregateSumField = decodedQuery
      .split('&aggregatesumfield=')[1]
      .split('&controlinfo=')[0];
    let CollectionModel: typeof Model;

    switch (collection) {
      case 'appcollectionfields':
        CollectionModel = AppCollectionFieldModel;
        break;
      case 'brands':
        CollectionModel = BrandModel;
        break;
      case 'productmovements':
        CollectionModel = ProductMovementModel;
        break;
      case 'products':
        CollectionModel = ProductModel;
        break;
      case 'translations':
        CollectionModel = TranslationModel;
        break;
      case 'users':
        CollectionModel = UserModel;
        break;
      default:
        CollectionModel = UserModel;
    }

    let searchValueRegexPattern: RegExp; // Contains
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
      case 'Contains':
        searchValueRegexPattern = new RegExp(`${searchValue}`);
        break;
      default:
        // eslint-disable-next-line prefer-regex-literals
        searchValueRegexPattern = new RegExp(`.*.`);
    }

    const searchObjectPattern =
      searchField === 'id' || searchField === '_id'
        ? { _id: new mongoose.Types.ObjectId(searchValue) }
        : {
            [searchField]: { $regex: searchValueRegexPattern },
          };
    // Use [searchKey] expression instead of $searchKey to force aggregate method to identify searchKey as a parameter, not a property.
    // $match does not work with regexp for field id because ObjectID is stored as 12 binary bytes and regex is a 24-byte string
    // $match does not work for field id because ObjectID is stored as 12 binary bytes and regex is a 24-byte string. See https://stackoverflow.com/questions/36193289/moongoose-aggregate-match-does-not-match-ids

    let data: { _id: string; documents: number; aggregateSumValue: number }[] =
      await CollectionModel.aggregate([
        { $match: searchObjectPattern },

        // Place the $match as early in the aggregation pipeline as possible. Because $match limits the total number of documents in the aggregation pipeline, earlier $match operations minimize the amount of later processing. If you place a $match at the very beginning of a pipeline, the query can take advantage of indexes like any other db.collection.find() or db.collection.findOne().

        {
          $addFields: {
            addedFieldForCountingDocuments: 1,
          },
        },
        {
          $project: {
            _id: true,
            [firstGroupByField]: true,
            [secondGroupByField]: true,
            [aggregateSumField]: true,
            addedFieldForCountingDocuments: true,
          },
        },
        {
          $addFields: {
            combinedGroupByField: {
              $concat: [firstGroupByField, stringSeparator, secondGroupByField],
            },
            combinedGroupByValue: {
              $concat: [
                '$' + firstGroupByField,
                stringSeparator,

                '$' + secondGroupByField,
              ],
            },
          },
        },
        {
          $group: {
            _id: '$combinedGroupByValue',
            documents: {
              $sum: '$addedFieldForCountingDocuments',
            },
            aggregateSumValue: {
              $sum: '$' + aggregateSumField,
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
            [firstGroupByField]: {
              $arrayElemAt: ['$combinedGroupByValueArray', 0],
            },
          },
        },
        {
          $addFields: {
            firstGroupByField,
          },
        },
        {
          $addFields: {
            secondGroupByField,
          },
        },
        {
          $addFields: {
            searchField,
          },
        },

        {
          $addFields: {
            aggregateSumField,
          },
        },
        {
          $addFields: {
            searchValue,
          },
        },
        {
          $addFields: {
            searchType,
          },
        },
        {
          $addFields: {
            collection,
          },
        },
        {
          $project: {
            collection: true,
            firstGroupByField: true,
            secondGroupByField: true,
            searchField: true,
            searchValue: true,
            searchType: true,
            aggregateSumField: true,
            aggregateSumValue: true,
            documents: true,
            combinedGroupByValueArray: true,
          },
        },

        {
          $sort: {
            _id: 1,
          },
        },
      ]);

    if (!data)
      throw new HTTPError(
        404,
        'Impossible to groupBy at collection' + collection,
        'Impossible to groupBy at collection' + collection
      );

    if (data.length === 0) {
      data = [{ _id: stringSeparator, documents: 0, aggregateSumValue: 0 }];
    }

    // Defensive result when there is no groupBy results
    return data;
  }

  async groupBySet(encodedQuery: string) {
    debug('groupBySet-method');
    const decodedQuery = decodeURI(encodedQuery);

    const collection = decodedQuery
      .split('&collection=')[1]
      .split('&groupbyfield=')[0];

    const groupByField = decodedQuery
      .split('&groupbyfield=')[1]
      .split('&controlinfo=')[0];
    let CollectionModel: typeof Model;

    switch (collection) {
      case 'appcollectionfields':
        CollectionModel = AppCollectionFieldModel;
        break;
      case 'brands':
        CollectionModel = BrandModel;
        break;
      case 'products':
        CollectionModel = ProductModel;
        break;
      case 'productmovements':
        CollectionModel = ProductMovementModel;
        break;
      case 'translations':
        CollectionModel = TranslationModel;
        break;
      case 'users':
        CollectionModel = UserModel;
        break;
      default:
        CollectionModel = UserModel;
    }

    const groupByFieldPattern = groupByField === 'id' ? '_id' : groupByField;

    let data: { set: string }[] = await CollectionModel.aggregate([
      {
        $group: {
          _id: '$' + groupByFieldPattern,
          set: {
            $min: '$' + groupByFieldPattern,
          },
        },
      },
      {
        $project: {
          _id: 0,
          set: 1,
        },
      },
      {
        $sort: {
          set: 1,
        },
      },
    ]);

    if (!data)
      throw new HTTPError(
        404,
        'Impossible to obtain the grouped set of values at collection' +
          collection,
        'Impossible to obtain the grouped set of values at collection' +
          collection
      );

    if (data.length === 0) {
      data = [{ set: '' }];
    }

    // Defensive result when there is no groupBy results
    const dataSet = data.map((item) => item.set.toString());

    return dataSet;
  }

  async create(encodedQuery: string, newDocument: unknown): Promise<unknown> {
    debug('create-method');
    const decodedQuery = decodeURI(encodedQuery);

    const collection = decodedQuery
      .split('&collection=')[1]
      .split('&controlinfo=')[0];

    let CollectionModel: typeof Model;
    switch (collection) {
      case 'appcollectionfields':
        CollectionModel = AppCollectionFieldModel;
        break;
      case 'brands':
        CollectionModel = BrandModel;
        break;
      case 'products':
        CollectionModel = ProductModel;
        break;
      case 'productmovements':
        CollectionModel = ProductMovementModel;
        break;
      case 'translations':
        CollectionModel = TranslationModel;
        break;
      case 'users':
        CollectionModel = UserModel;
        break;
      default:
        CollectionModel = UserModel;
    }

    const data = await CollectionModel.create(newDocument);
    return data;
  }

  async sample() {
    debug('sample-method');
    const data = await UserModel.aggregate([
      { $addFields: { toStringId: { $toString: '$_id' } } },
      { $match: { toStringId: '641630973d33d27957edd7b1' } },
    ]);

    if (!data)
      throw new HTTPError(
        404,
        'Impossible to sample at collection',
        'Impossible to sample at collection'
      );

    return data;
  }
}
