import { Response, Request, NextFunction } from 'express';
import createDebug from 'debug';

import { HTTPError } from '../interfaces/error.js';
import { ProductMovementMongoRepo } from '../repositories/productmovements.mongo.repo';
const debug = createDebug('ERP:controller:users');
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
      throw new HTTPError(400, 'analytics Not found', 'analytics Not found');
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
      throw new HTTPError(400, 'Gallery Not found', 'Gallery Not found');
      next(error);
    }
  }

  async getById(req: Request, resp: Response, next: NextFunction) {
    debug('entrando en el controller');
    try {
      const getId = req.params.id;
      const data = await this.repo.queryId(getId);
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

  async countRecords(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('countFilteredRecords-method');
      const data = await this.repo.countRecords();
      resp.json({
        results: [data],
      });
    } catch (error) {
      next(error);
    }
  }
}
