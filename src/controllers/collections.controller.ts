import { Response, Request, NextFunction } from 'express';
import createDebug from 'debug';
import { HTTPError } from '../interfaces/error.js';

import { CollectionsMongoRepo } from '../repositories/collections.mongo.repo';
const debug = createDebug('ERP:controller:collections');

export class CollectionsController {
  constructor(public repo: CollectionsMongoRepo) {
    debug('Instantiate');
  }

  async readRecords(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('readRecords-method');
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

      const data = await this.repo.readRecords(req.path);
      if (!data)
        throw new HTTPError(
          422,
          'Unprocessable Content',
          'readRecords method has not been applied'
        );
      resp.status(200);
      resp.json({
        results: data,
      });
    } catch (error) {
      next(error);
    }
  }

  async readRecordFieldValue(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('readRecordFieldValue-method');
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
          'Query Id needed in the request with information about the record to read'
        );

      const data = await this.repo.readRecordFieldValue(req.path);
      if (!data)
        throw new HTTPError(
          422,
          'Unprocessable Content',
          'readRecordFieldValue method has not been applied'
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
          'Query Id needed in the request with information about the groupBy to read'
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
          'Query Id needed in the request with information about the groupBySet to read'
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

  async create(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('create-method');
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

      if (!req.body)
        throw new HTTPError(
          400,
          'Bad request',
          'Body needed in the request with information about the document to create'
        );

      const data = await this.repo.create(req.path, req.body);
      if (!data)
        throw new HTTPError(
          422,
          'Unprocessable Content',
          'create method has not been applied'
        );
      resp.status(200);
      resp.json({
        results: data,
      });
    } catch (error) {
      next(error);
    }
  }

  async sample(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('sample-method');
      if (
        req.headers.authorization === undefined ||
        !req.headers.authorization.startsWith('Bearer ')
      )
        throw new HTTPError(
          401,
          'Unauthorized',
          'A valid token is needed in the authorization header'
        );

      const data = await this.repo.sample();
      if (!data)
        throw new HTTPError(
          422,
          'Unprocessable Content',
          'sample method has not been applied'
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
