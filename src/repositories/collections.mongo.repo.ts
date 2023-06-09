import createDebug from 'debug';
import { AppCollectionFieldModel } from './appcollectionfields.mongo.model.js';
import { BrandModel } from './brands.mongo.model.js';
import { ProductMovementModel } from './productmovements.mongo.model.js';
import { ProductModel } from './products.mongo.model.js';
import { UserModel } from './users.mongo.model.js';
import mongoose, { Model } from 'mongoose';
import { HTTPError } from '../interfaces/error.js';
import { stringSeparator } from '../config.js';
import { TranslationModel } from './translations.mongo.model.js';
import { RequestLogModel } from './requestlog.mongo.model.js';

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

  async calculate(encodedQuery: string): Promise<
    {
      collection: string;
      documentId: string;
      operation: string;
      firstOperandField: string;
      secondOperandField: string;
      result: string;
      resultStatus: string;
    }[]
  > {
    debug('calculate-method');

    const decodedQuery = decodeURI(encodedQuery);

    const collection = decodedQuery
      .split('&collection=')[1]
      .split('&documentid=')[0];
    const documentId = decodedQuery
      .split('&documentid=')[1]
      .split('&operation=')[0];
    const operation = decodedQuery
      .split('&operation=')[1]
      .split('&firstoperandfield=')[0];
    const firstOperandField = decodedQuery
      .split('&firstoperandfield=')[1]
      .split('&secondtoperandfield=')[0];
    const secondOperandField = decodedQuery
      .split('&secondtoperandfield=')[1]
      .split('&controlinfo=')[0];

    let CollectionModel: typeof Model;
    switch (collection) {
      case 'products':
        CollectionModel = ProductModel;
        break;
      case 'productmovements':
        CollectionModel = ProductMovementModel;
        break;
      default:
        CollectionModel = ProductModel;
    }

    const matchObjectPattern = { _id: new mongoose.Types.ObjectId(documentId) };

    let mongooseOperator: string;
    switch (operation) {
      case 'addition':
        mongooseOperator = '$add';
        break;
      case 'subtraction':
        mongooseOperator = '$subtract';
        break;
      case 'multiplication':
        mongooseOperator = '$multiply';
        break;
      case 'division':
        mongooseOperator = '$divide';
        break;
      case 'percentageoversecondoperand': {
        const data = await CollectionModel.aggregate([
          { $match: matchObjectPattern },
          {
            $project: {
              [firstOperandField]: true,
              [secondOperandField]: true,
            },
          },
          {
            $addFields: {
              collection,
              documentId,
              operation,
              firstOperandField,
              secondOperandField,
              provisionalResult1: {
                $subtract: [
                  '$' + [firstOperandField],
                  '$' + [secondOperandField],
                ],
              },
              resultStatus: 'calculated',
            },
          },
          {
            $addFields: {
              provisionalResult2: {
                $divide: ['$provisionalResult1', '$' + [secondOperandField]],
              },
            },
          },
          {
            $addFields: {
              result: {
                $multiply: ['$provisionalResult2', 100],
              },
            },
          },
        ]);
        if (!data || data.length === 0) {
          return [
            {
              collection,
              documentId,
              operation,
              firstOperandField,
              secondOperandField,
              result: 'not available',
              resultStatus: 'not available',
            },
          ];
        }

        return [data[0]];
      }

      case 'percentageoverfirstoperand': {
        const data = await CollectionModel.aggregate([
          { $match: matchObjectPattern },
          {
            $project: {
              [firstOperandField]: true,
              [secondOperandField]: true,
            },
          },
          {
            $addFields: {
              collection,
              documentId,
              operation,
              firstOperandField,
              secondOperandField,
              provisionalResult1: {
                $subtract: [
                  '$' + [firstOperandField],
                  '$' + [secondOperandField],
                ],
              },
              resultStatus: 'calculated',
            },
          },
          {
            $addFields: {
              provisionalResult2: {
                $divide: ['$provisionalResult1', '$' + [firstOperandField]],
              },
            },
          },
          {
            $addFields: {
              result: {
                $multiply: ['$provisionalResult2', 100],
              },
            },
          },
        ]);
        if (!data || data.length === 0) {
          return [
            {
              collection,
              documentId,
              operation,
              firstOperandField,
              secondOperandField,
              result: 'not available',
              resultStatus: 'not available',
            },
          ];
        }

        return [data[0]];
      }

      default:
        mongooseOperator = '$';
    }

    const data = await CollectionModel.aggregate([
      { $match: matchObjectPattern },
      {
        $project: {
          [firstOperandField]: true,
          [secondOperandField]: true,
        },
      },
      {
        $addFields: {
          collection,
          documentId,
          operation,
          firstOperandField,
          secondOperandField,
          result: {
            [mongooseOperator]: [
              '$' + [firstOperandField],
              '$' + [secondOperandField],
            ],
          },
          resultStatus: 'calculated',
        },
      },
    ]);

    if (!data || data.length === 0) {
      return [
        {
          collection,
          documentId,
          operation,
          firstOperandField,
          secondOperandField,
          result: 'not available',
          resultStatus: 'not available',
        },
      ];
    }

    return [data[0]];
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
      case 'requestlogs':
        CollectionModel = RequestLogModel;
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
        searchValueRegexPattern = new RegExp(`${searchValue}`);
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

  async measure(encodedQuery: string): Promise<
    {
      measure: string;
      measureDescription: string;
      measureLabel: string;
      measureInput: string;
      measureOutput: number;
      measureUnits: string;
      measureStatus: string;
    }[]
  > {
    debug('measure-method');

    const decodedQuery = decodeURI(encodedQuery);

    const measure = decodedQuery
      .split('&measure=')[1]
      .split('&measureinput=')[0];

    console.log(measure);
    const measureInput = decodedQuery
      .split('&measureinput=')[1]
      .split('&controlinfo=')[0];
    console.log(measureInput);

    switch (measure) {
      case 'countdocumentsbycollection': {
        let CollectionModel: typeof Model;
        switch (measureInput) {
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
          case 'requestlogs':
            CollectionModel = RequestLogModel;
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

        const data = await CollectionModel.aggregate([
          {
            $addFields: {
              addedFieldForCountingDocuments: 1,
            },
          },
          {
            $group: {
              _id: 'Total',
              measureOutput: {
                $sum: '$addedFieldForCountingDocuments',
              },
            },
          },
          {
            $addFields: {
              measure,
            },
          },
          {
            $addFields: {
              measureUnits: 'documents',
            },
          },
          {
            $addFields: {
              measureDescription: 'count of documents by collection',
            },
          },

          {
            $addFields: {
              measureLabel: measureInput,
            },
          },
          {
            $addFields: {
              measureInput: '$_id',
            },
          },
          {
            $addFields: {
              setStatus: 'calculated',
            },
          },
        ]);

        if (!data || data.length === 0) {
          return [
            {
              measure,
              measureDescription:
                'count of documents at collection ' + measureInput,
              measureLabel: 'collection',
              measureInput,
              measureOutput: 0,
              measureUnits: 'documents',
              measureStatus:
                'count of documents at collection' +
                measureInput +
                ' not found',
            },
          ];
        }

        return [data[0]];
      }

      case 'productstockcost': {
        const data = await ProductMovementModel.aggregate([
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
              measureOutput: {
                $sum: '$unitsXunitaryCost',
              },
            },
          },
          {
            $addFields: {
              measure,
            },
          },
          {
            $addFields: {
              measureUnits: '€',
            },
          },
          {
            $addFields: {
              measureDescription: 'stock of product, measured in € of cost',
            },
          },

          {
            $addFields: {
              measureLabel: 'Total',
            },
          },
          {
            $addFields: {
              measureInput: '$_id',
            },
          },
          {
            $addFields: {
              setStatus: 'calculated',
            },
          },
        ]);

        if (!data || data.length === 0) {
          return [
            {
              measure,
              measureDescription: 'stock of products, measured in units',
              measureLabel: 'all products',
              measureInput,
              measureOutput: 0,
              measureUnits: 'units',
              measureStatus: 'stock of products not found',
            },
          ];
        }

        return [data[0]];
      }

      case 'productstockunitsbysku': {
        const data = await ProductMovementModel.aggregate([
          { $match: { productSku: measureInput } },
          {
            $group: {
              _id: '$productSku',
              measureOutput: {
                $sum: '$units',
              },
            },
          },
          {
            $addFields: {
              measure,
            },
          },
          {
            $addFields: {
              measureUnits: 'units',
            },
          },
          {
            $addFields: {
              measureDescription: 'stock of product by sku, measured in units',
            },
          },

          {
            $addFields: {
              measureLabel: 'product sku',
            },
          },
          {
            $addFields: {
              measureInput: '$_id',
            },
          },
          {
            $addFields: {
              setStatus: 'calculated',
            },
          },
        ]);

        if (!data || data.length === 0) {
          return [
            {
              measure,
              measureDescription: 'stock of product by sku, measured in units',
              measureLabel: 'product sku',
              measureInput,
              measureOutput: 0,
              measureUnits: 'units',
              measureStatus: 'productSku=' + measureInput + ' not found',
            },
          ];
        }

        return [data[0]];
      }

      case 'productstockunits': {
        const data = await ProductMovementModel.aggregate([
          {
            $group: {
              _id: 'all products',
              measureOutput: {
                $sum: '$units',
              },
            },
          },
          {
            $addFields: {
              measure,
            },
          },
          {
            $addFields: {
              measureUnits: 'units',
            },
          },
          {
            $addFields: {
              measureDescription: 'stock of products, measured in units',
            },
          },

          {
            $addFields: {
              measureLabel: 'all products',
            },
          },
          {
            $addFields: {
              measureInput: '$_id',
            },
          },
          {
            $addFields: {
              setStatus: 'calculated',
            },
          },
        ]);

        if (!data || data.length === 0) {
          return [
            {
              measure,
              measureDescription: 'stock of products, measured in units',
              measureLabel: 'all products',
              measureInput,
              measureOutput: 0,
              measureUnits: 'units',
              measureStatus: 'stock of products not found',
            },
          ];
        }

        return [data[0]];
      }

      default:
        return [
          {
            measure,
            measureDescription: 'measure ' + measure + ' is not implemented',
            measureLabel: 'measureLabel',
            measureInput,
            measureOutput: 0,
            measureUnits: 'measureUnits',
            measureStatus: 'measure ' + measure + ' is not implemented',
          },
        ];
    }
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
        searchValueRegexPattern = new RegExp(`${searchValue}`);
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

  async view(encodedQuery: string): Promise<unknown[]> {
    debug('view-method');

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
          outputFieldValue: 'Info not found (backend)',
          outputStatus: 'ko',
        },
      ];
    }

    // Defensive result when there is no groupBy results

    return data;
  }
}
