import { Response, Request, NextFunction } from 'express';
import createDebug from 'debug';
import { ReqRespMongoRepo } from '../repositories/reqresp.mongo.repo';
import morgan from 'morgan';
const debug = createDebug('ERP:controller:users');

export class ReqRespController {
  constructor(public repo: ReqRespMongoRepo) {
    debug('Instantiate ReqRespController');
  }

  async create(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('create ReqRespController');

      const morganLog = morgan((tokens, req, res) =>
        [
          req.method,
          req.url,
          req.headers.authorization,
          req.statusCode,
          res.statusMessage,
          res.statusCode,
          tokens['response-time'](req, res),
          'ms',
        ].join(' ')
      );

      const morganLogTemp = morganLog.toString();
      debug(morganLogTemp);

      const data = await this.repo.create({ request: 'morganLogTemp' });
      resp.status(201);
      resp.json({
        results: [data],
      });
    } catch (error) {
      next(error);
    }
  }

  async query(_req: Request, resp: Response, next: NextFunction) {
    try {
      debug('query:get');
      const data = await this.repo.query();
      resp.json({
        results: data,
      });
    } catch (error) {
      next(error);
    }
  }
}
