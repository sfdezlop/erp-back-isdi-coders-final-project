export {};
// Import createDebug from 'debug';
// import { userSchema } from '../repositories/users.mongo.model.js';
// import { model } from 'mongoose';
// const debug = createDebug('ERP:superepo:users');
// export type MongoCollectionType = typeof model;
// export class MongoRepo {
//   collection;
//   filterKey;
//   filterStringValue;
//   filterNumberValue;
//   filterSet;
//   filterRecordsPerSet;
//   queryKey?;
//   queryStringValue?;
//   queryNumberValue?;
//   groupByKey?;
//   orderByKey?;
//   orderType?;
//   constructor(
//     collection: MongoCollectionType,
//     filterKey: string,
//     filterStringValue: string,
//     filterNumberValue: number,
//     filterRecordsPerSet: number,
//     filterSet: number,
//     queryKey: string,
//     queryStringValue: string,
//     queryNumberValue: number,
//     groupByKey: string,
//     orderByKey: string,
//     orderType: 'ASC' | 'DESC' | null
//   ) {
//     debug('Instantiated at constructor');
//     this.collection = collection;
//     this.filterKey = filterKey;
//     this.filterStringValue = filterStringValue;
//     this.filterNumberValue = filterNumberValue;
//     this.filterSet = filterSet;
//     this.filterRecordsPerSet = filterRecordsPerSet;
//     this.queryKey = queryKey;
//     this.queryStringValue = queryStringValue;
//     this.queryNumberValue = queryNumberValue;
//     this.groupByKey = groupByKey;
//     this.orderByKey = orderByKey;
//     this.orderType = orderType;
//   }
//   async getByFilterWithPagination(): Promise<unknown> {
//     debug('Instantiated at constructor at query method');
//     const data = await this.collection(
//       this.collection.toString(),
//       userSchema,
//       this.collection.toString().toLowerCase() + 's'
//     )
//       .find({ [this.filterKey]: this.filterStringValue })
//       .skip((this.filterSet - 1) * this.filterRecordsPerSet)
//       .limit(this.filterRecordsPerSet);
//     return data;
//   }
// }
