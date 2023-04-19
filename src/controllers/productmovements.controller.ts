import { Response, Request, NextFunction } from 'express';
import createDebug from 'debug';

import { HTTPError } from '../interfaces/error.js';
import { ProductMovementMongoRepo } from '../repositories/productmovements.mongo.repo';
const debug = createDebug('ERP:controller:productmovements');
export class ProductMovementsController {
  constructor(public repo: ProductMovementMongoRepo) {
    debug('Instantiate');
  }

  async analytics(_req: Request, resp: Response, next: NextFunction) {
    try {
      const data = await this.repo.analytics();
      resp.json({
        results: data,
      });
    } catch (error) {
      next(error);
      throw new HTTPError(400, 'analytics Not found', 'analytics Not found');
    }
  }

  async create(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('create:post');
      if (!req.body) throw new HTTPError(404, 'Body needed', 'Body needed');
      const data = await this.repo.create(req.body);
      resp.json({
        results: data,
      });
    } catch (error) {
      throw new HTTPError(
        400,
        'Creation is not possible',
        'Creation is not possible'
      );
      next(error);
    }
  }

  async getByFilterWithPaginationAndOrder(
    req: Request,
    resp: Response,
    next: NextFunction
  ) {
    try {
      const data = await this.repo.getByFilterWithPaginationAndOrder(req.body);
      resp.json({
        results: data,
      });
    } catch (error) {
      next(error);
      throw new HTTPError(400, 'Gallery Not found', 'Gallery Not found');
    }
  }

  async getById(req: Request, resp: Response, next: NextFunction) {
    try {
      const getId = req.params.id;
      const data = await this.repo.queryId(getId);
      resp.json({
        results: data,
      });
    } catch (error) {
      next(error);
      throw new HTTPError(400, 'Record Not found', 'Record Not found');
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
      throw new HTTPError(
        400,
        'Count is not possible',
        'Count is not possible'
      );
    }
  }

  async countRecords(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('countFilteredRecords-method');
      const data = await this.repo.countRecords();
      resp.json({
        results: [data],
      });
    } catch (error) {
      next(error);
      throw new HTTPError(
        400,
        'Count is not possible',
        'Count is not possible'
      );
    }
  }

  async stockBySku(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('stockBySku-method');
      const data = await this.repo.stockBySku(req.params.id);
      resp.json({
        results: data,
      });
    } catch (error) {
      next(error);
      throw new HTTPError(
        400,
        'Calculation of stock by sku is not possible',
        'Calculation of stock by sku is not possible'
      );
    }
  }

  async stock(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('stock-method');
      const data = await this.repo.stock();
      resp.json({
        results: data,
      });
    } catch (error) {
      next(error);
      throw new HTTPError(
        400,
        'Calculation of stock is not possible',
        'Calculation of stock is not possible'
      );
    }
  }
}
