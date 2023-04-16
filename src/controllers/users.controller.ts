import { Response, Request, NextFunction } from 'express';
import createDebug from 'debug';
import { User } from '../entities/user.entity';
// Import { Permission } from '../entities/permission.entity';
import { Repo } from '../repositories/repo.interface';
import { HTTPError } from '../interfaces/error.js';
import { Auth, PayloadToken } from '../services/auth.js';
// Import { PermissionsMongoRepo } from '../repositories/permissions.mongo.repo.js';
const debug = createDebug('ERP:controller:users');
export class UsersController {
  constructor(public repo: Repo<User>) {
    debug('Instantiate');
  }

  async register(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('register:post');
      if (!req.body.email || !req.body.passwd)
        throw new HTTPError(401, 'Unauthorized', 'Invalid Email or password');
      req.body.passwd = await Auth.hash(req.body.passwd);
      const data = await this.repo.create(req.body);
      resp.status(201);
      resp.json({
        results: [data],
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('login:post ');
      if (!req.body.email || !req.body.passwd)
        throw new HTTPError(401, 'Unauthorized', 'Invalid Email or password');
      const dataUser = await this.repo.search({
        key: 'email',
        value: req.body.email,
      });
      if (!dataUser.length)
        throw new HTTPError(401, 'Unauthorized', 'Email not found');
      if (!(await Auth.compare(req.body.passwd, dataUser[0].passwd)))
        throw new HTTPError(401, 'Unauthorized', 'Password not match');
      const payload: PayloadToken = {
        id: dataUser[0].id,
        email: dataUser[0].email,
      };

      const token = Auth.createJWT(payload);
      const dataUsers = await this.repo.query();

      // Const permissionsRepo = new PermissionsMongoRepo();
      // if (!dataUser[0].email)
      //   throw new HTTPError(
      //     401,
      //     'Not permissions found for this email',
      //     'Not permissions found for this email'
      //   );

      // const dataPermissions = await permissionsRepo.search({
      //   key: 'userEmail',
      //   value: dataUser[0].email,
      // });

      resp.status(202);

      resp.json({
        results: [token, dataUser[0], dataUsers],
      });
    } catch (error) {
      next(error);
    }
  }

  async loginWithToken(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('loginWithToken:post');
      if (!req.body.token)
        throw new HTTPError(401, 'No Token to check', 'No Token to check');

      const payloadOfToken: PayloadToken = Auth.verifyJWTGettingPayload(
        req.body.token
      );

      const emailOfPayload = payloadOfToken.email;
      if (!emailOfPayload || emailOfPayload === undefined)
        throw new HTTPError(
          411,
          'Invalid token. Not possible to extract the payload',
          'Invalid token. Not possible to extract the payload'
        );

      const dataUser = await this.repo.search({
        key: 'email',
        value: emailOfPayload,
      });
      if (!dataUser.length)
        throw new HTTPError(401, 'Invalid token', 'Invalid token');
      const payload: PayloadToken = {
        id: dataUser[0].id,
        email: dataUser[0].email,
      };

      const newToken = Auth.createJWT(payload);
      const dataUsers = await this.repo.query();
      resp.status(202);

      resp.json({
        results: [newToken, dataUser[0], dataUsers],
      });
    } catch (error) {
      next(error);
    }
  }

  async countRecords(_req: Request, resp: Response, next: NextFunction) {
    try {
      debug('count:get');
      const data = await this.repo.countRecords();
      resp.status(700);
      resp.json({
        count: [data],
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
