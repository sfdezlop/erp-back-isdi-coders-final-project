import { Response, Request, NextFunction } from 'express';
import createDebug from 'debug';
import { HTTPError } from '../interfaces/error.js';

import { CollectionsMongoRepo } from '../repositories/collections.mongo.repo';
const debug = createDebug('ERP:controller:collections');

export class CollectionsController {
  constructor(public repo: CollectionsMongoRepo) {
    debug('Instantiate');
  }

  async read(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('read-method');
      if (
        req.headers.authorization === undefined ||
        !req.headers.authorization.startsWith('Bearer ')
      )
        throw new HTTPError(
          401,
          'Unauthorized',
          'A valid token is needed in the authorization header'
        );
      if (!req.params.id)
        throw new HTTPError(
          400,
          'Bad request',
          'Query Id needed in the request with information about the records to read'
        );

      const data = await this.repo.read(req.path);
      if (!data)
        throw new HTTPError(
          422,
          'Unprocessable Content',
          'read method has not been applied'
        );
      resp.status(200);
      resp.json({
        results: data,
      });
    } catch (error) {
      next(error);
    }
  }

  async groupBy(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('groupBy-method');
      if (
        req.headers.authorization === undefined ||
        !req.headers.authorization.startsWith('Bearer ')
      )
        throw new HTTPError(
          401,
          'Unauthorized',
          'A valid token is needed in the authorization header'
        );
      if (!req.params.id)
        throw new HTTPError(
          400,
          'Bad request',
          'Query Id needed in the request with information about the records to read'
        );

      const data = await this.repo.groupBy(req.path);
      if (!data)
        throw new HTTPError(
          422,
          'Unprocessable Content',
          'groupBy method has not been applied'
        );
      resp.status(200);
      resp.json({
        results: data,
      });
    } catch (error) {
      next(error);
    }
  }

  async groupBySet(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('groupBySet-method');
      if (
        req.headers.authorization === undefined ||
        !req.headers.authorization.startsWith('Bearer ')
      )
        throw new HTTPError(
          401,
          'Unauthorized',
          'A valid token is needed in the authorization header'
        );
      if (!req.params.id)
        throw new HTTPError(
          400,
          'Bad request',
          'Query Id needed in the request with information about the records to read'
        );

      const data = await this.repo.groupBySet(req.path);
      if (!data)
        throw new HTTPError(
          422,
          'Unprocessable Content',
          'groupBySet method has not been applied'
        );
      resp.status(200);
      resp.json({
        results: data,
      });
    } catch (error) {
      next(error);
    }
  }
}
