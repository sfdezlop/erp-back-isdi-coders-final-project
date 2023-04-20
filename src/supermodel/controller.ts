export {};
// Import { Response, Request, NextFunction } from 'express';
// import createDebug from 'debug';
// import { HTTPError } from '../interfaces/error.js';
// import { MongoRepo } from './mongo.repo.js';
// const debug = createDebug('ERP:controller:users');
// export class Controller {
//   constructor(public repo: MongoRepo) {
//     debug('Instantiate');
//   }
//   async getByFilterWithPagination(
//     _req: Request,
//     resp: Response,
//     next: NextFunction
//   ) {
//     try {
//       debug('getByFilterWithPagination');
//       const data = await this.repo.getByFilterWithPagination();
//       if (!data)
//         throw new HTTPError(
//           404,
//           'Set of records not found in the collection',
//           'Set of records not found in the collection'
//         );
//       resp.json({
//         results: data,
//       });
//     } catch (error) {
//       next(error);
//     }
//   }
// }
