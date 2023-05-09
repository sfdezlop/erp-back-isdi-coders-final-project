import { Response, Request, NextFunction } from 'express';
import createDebug from 'debug';

import { HTTPError } from '../interfaces/error.js';
import { ProductsMongoRepo } from '../repositories/products.mongo.repo';
const debug = createDebug('ERP:controller:users');
export class ProductsController {
  constructor(public repo: ProductsMongoRepo) {
    debug('Instantiate');
  }

  async getByFilterWithPaginationAndOrder(
    req: Request,
    resp: Response,
    next: NextFunction
  ) {
    try {
      debug('getByFilterWithPaginationAndOrder');
      const data = await this.repo.getByFilterWithPaginationAndOrder(req.body);
      resp.json({
        results: data,
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, resp: Response, next: NextFunction) {
    try {
      const getId = req.params.id;
      const data = await this.repo.queryId(getId);
      resp.json({
        results: [data],
      });
    } catch (error) {
      next(error);
    }
  }

  async getByKey(req: Request, resp: Response, next: NextFunction) {
    try {
      const getKey = req.params.path;
      const getValue = req.params.id;
      const data = await this.repo.queryByKey({
        key: getKey,
        value: getValue,
      });
      resp.json({
        results: data,
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('create:post');
      if (!req.body) throw new HTTPError(404, 'Body needed', 'Body needed');
      const data = await this.repo.create(req.body);

      resp.status(201);
      resp.json({
        results: [data],
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('update-method');

      if (!req.params.id)
        throw new HTTPError(404, 'Not found', 'Not found id user in params');

      req.body.id = req.params.id;

      const userData = await this.repo.update(req.body.id);

      resp.status(201);
      resp.json({
        results: [userData],
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteById(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('deleteById-method');
      const deleteId = req.params.id;
      const data = await this.repo.deleteById(deleteId);
      resp.json({
        results: data,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteByKey(req: Request, resp: Response, next: NextFunction) {
    try {
      const deleteKey = req.params.path;
      const deleteValue = req.params.id;
      const data = await this.repo.deleteByKey(deleteKey, deleteValue);
      resp.json({
        results: data,
      });
    } catch (error) {
      next(error);
    }
  }

  async countFilteredRecords(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('countFilteredRecords-method');
      const data = await this.repo.countFilteredRecords(req.body);
      resp.status(200);
      resp.json({
        results: [data],
      });
    } catch (error) {
      next(error);
    }
  }

  async leftJoinProductMovements(
    req: Request,
    resp: Response,
    next: NextFunction
  ) {
    try {
      const data = await this.repo.leftJoinProductMovements();
      resp.json({
        results: data,
      });
    } catch (error) {
      next(error);
    }
  }

  async groupValuesPerField(req: Request, resp: Response, next: NextFunction) {
    try {
      const fieldToGroup = req.params.id;
      const data = await this.repo.groupValuesPerField(fieldToGroup);
      resp.status(200);
      resp.json({
        results: data,
      });
    } catch (error) {
      next(error);
    }
  }

  async microserviceQueryByKeyValue(
    req: Request,
    resp: Response,
    next: NextFunction
  ) {
    try {
      debug('microserviceQueryByKeyValue-method');
      if (
        !req.headers.authorization ||
        !req.headers.authorization.startsWith('Bearer ')
      )
        throw new HTTPError(
          401,
          'Unauthorized',
          'A valid token is needed in the authorization header'
        );
      if (!req.params.id || !req.params.path)
        throw new HTTPError(
          400,
          'Bad request',
          'Path and Id needed in the request with information about the record to find'
        );

      const inputKey = req.params.path
        .split('inputkey-')[1]
        .split('-outputkey-')[0];
      const outputKey = req.params.path.split('-outputkey-')[1];
      const inputValue = req.params.id.split('inputvalue-')[1];

      const data = await this.repo.microserviceQueryByKeyValue(
        inputKey,
        inputValue,
        outputKey
      );
      if (!data)
        throw new HTTPError(
          422,
          'Unprocessable Content',
          'microserviceQueryByKeyValue has not been applied'
        );
      resp.status(200);
      resp.json({
        results: [data],
      });
    } catch (error) {
      next(error);
    }
  }
}
