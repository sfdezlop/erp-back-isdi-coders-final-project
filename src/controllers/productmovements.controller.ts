import { Response, Request, NextFunction } from 'express';
import createDebug from 'debug';

import { HTTPError } from '../interfaces/error.js';
import { ProductMovementMongoRepo } from '../repositories/productmovements.mongo.repo';
const debug = createDebug('ERP:controller:productmovements');
export class ProductMovementsController {
  constructor(public repo: ProductMovementMongoRepo) {
    debug('Instantiate');
  }

  async analytics(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('analytics:get');
      if (
        !req.headers.authorization ||
        !req.headers.authorization.startsWith('Bearer ')
      )
        throw new HTTPError(
          401,
          'Unauthorized',
          'A token is needed in the authorization header'
        );
      const data = await this.repo.analytics();
      if (!data)
        throw new HTTPError(404, 'Analytics Not found', 'Analytics Not found');
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
      debug('create:post');
      if (
        !req.headers.authorization ||
        !req.headers.authorization.startsWith('Bearer ')
      )
        throw new HTTPError(
          401,
          'Unauthorized',
          'A token is needed in the authorization header'
        );
      if (!req.body)
        throw new HTTPError(
          400,
          'Bad request',
          'Body needed in the request with information about the new record to create'
        );

      const data = await this.repo.create(req.body);
      if (!data)
        throw new HTTPError(
          422,
          'Unprocessable Content',
          'Record has not been created'
        );
      resp.status(201);
      resp.json({
        results: [data],
      });
    } catch (error) {
      next(error);
    }
  }

  async getByFilterWithPaginationAndOrder(
    req: Request,
    resp: Response,
    next: NextFunction
  ) {
    try {
      debug('getByFilterWithPaginationAndOrder:post');
      if (
        !req.headers.authorization ||
        !req.headers.authorization.startsWith('Bearer ')
      )
        throw new HTTPError(
          401,
          'Unauthorized',
          'A token is needed in the authorization header'
        );
      if (!req.body)
        throw new HTTPError(
          400,
          'Bad request',
          'Body needed in the request with information about the filter to apply'
        );
      const data = await this.repo.getByFilterWithPaginationAndOrder(req.body);
      if (!data)
        throw new HTTPError(
          422,
          'Unprocessable Content',
          'Filter has not been applied'
        );
      resp.status(200);
      resp.json({
        results: data,
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('getById:post');
      if (
        !req.headers.authorization ||
        !req.headers.authorization.startsWith('Bearer ')
      )
        throw new HTTPError(
          401,
          'Unauthorized',
          'A token is needed in the authorization header'
        );
      if (!req.params.id)
        throw new HTTPError(
          400,
          'Bad request',
          'Id needed in the request with information about the record to get'
        );
      const getId = req.params.id;
      const data = await this.repo.queryId(getId);
      if (!data)
        throw new HTTPError(404, 'Record not found', 'Record not found');
      resp.status(200);
      resp.json({
        results: data,
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
      debug('deleteByKey-method');
      const deleteKey = req.params.path;
      const deleteId = req.params.id;
      const data = await this.repo.deleteByKey(deleteKey, deleteId);
      resp.json({
        results: [data],
      });
    } catch (error) {
      next(error);
    }
  }

  async countFilteredRecords(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('countFilteredRecords:post');
      if (
        !req.headers.authorization ||
        !req.headers.authorization.startsWith('Bearer ')
      )
        throw new HTTPError(
          401,
          'Unauthorized',
          'A token is needed in the authorization header'
        );
      if (!req.body)
        throw new HTTPError(
          400,
          'Bad request',
          'A filter field and and a filter value are needed'
        );

      const data = await this.repo.countFilteredRecords(req.body);
      if (!data)
        throw new HTTPError(
          422,
          'Unprocessable Content',
          'Count filtered records has not been applied'
        );
      resp.status(200);
      resp.json({
        results: [data],
      });
    } catch (error) {
      next(error);
    }
  }

  async countRecords(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('countRecords:post');
      if (
        !req.headers.authorization ||
        !req.headers.authorization.startsWith('Bearer ')
      )
        throw new HTTPError(
          401,
          'Unauthorized',
          'A token is needed in the authorization header'
        );
      const data = await this.repo.countRecords();
      if (!data)
        throw new HTTPError(
          422,
          'Unprocessable Content',
          'Count records has not been applied'
        );
      resp.status(200);
      resp.json({
        results: [data],
      });
    } catch (error) {
      next(error);
    }
  }

  async stockBySku(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('stockBySku-method');
      if (
        !req.headers.authorization ||
        !req.headers.authorization.startsWith('Bearer ')
      )
        throw new HTTPError(
          401,
          'Unauthorized',
          'A token is needed in the authorization header'
        );
      if (!req.params.id)
        throw new HTTPError(
          400,
          'Bad request',
          'Id needed in the request with information about the record to get the stock'
        );
      const data = await this.repo.stockBySku(req.params.id);
      if (!data)
        throw new HTTPError(
          422,
          'Unprocessable Content',
          'Stock calculation has not been applied'
        );
      resp.status(200);
      resp.json({
        results: [data],
      });
    } catch (error) {
      next(error);
    }
  }

  async microserviceStockGroupByKeysFilteredByKeyValue(
    req: Request,
    resp: Response,
    next: NextFunction
  ) {
    try {
      debug('microserviceStockGroupByKeysFilteredByKeyValue-method');
      if (
        !req.headers.authorization ||
        !req.headers.authorization.startsWith('Bearer ')
      )
        throw new HTTPError(
          401,
          'Unauthorized',
          'A token is needed in the authorization header'
        );
      if (!req.params.path)
        throw new HTTPError(
          400,
          'Bad request',
          'Path needed in the request with information about the stock query'
        );
      if (!req.params.id)
        throw new HTTPError(
          400,
          'Bad request',
          'Id needed in the request with information about the stock query'
        );

      const firstGroupByKey = req.params.path
        .split('firstgroupbykey-')[1]
        .split('-secondgroupbykey-')[0];
      const secondGroupByKey = req.params.path
        .split('-secondgroupbykey-')[1]
        .split('-filterkey-')[0];
      const filterKey = req.params.path.split('-filterkey-')[1];
      const filterValue = req.params.id.split('filtervalue-')[1];

      const data =
        await this.repo.microserviceStockGroupByKeysFilteredByKeyValue(
          firstGroupByKey,
          secondGroupByKey,
          filterKey,
          filterValue
        );
      if (!data)
        throw new HTTPError(
          422,
          'Unprocessable Content',
          'Stock calculation has not been applied'
        );
      resp.status(200);
      resp.json({
        results: data,
      });
    } catch (error) {
      next(error);
    }
  }

  async stock(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('stock-method');
      if (
        !req.headers.authorization ||
        !req.headers.authorization.startsWith('Bearer ')
      )
        throw new HTTPError(
          401,
          'Unauthorized',
          'A token is needed in the authorization header'
        );
      const data = await this.repo.stock();
      if (!data)
        throw new HTTPError(
          422,
          'Unprocessable Content',
          'Stock calculation has not been applied'
        );
      resp.status(200);
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
}
