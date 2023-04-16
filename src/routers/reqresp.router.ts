import { Router } from 'express';
import { ReqRespController } from '../controllers/reqresp.controller.js';
import { ReqRespMongoRepo } from '../repositories/reqresp.mongo.repo.js';
import createDebug from 'debug';
const debug = createDebug('ERP:router:reqresp');

// eslint-disable-next-line new-cap
export const reqRespRouter = Router();
debug('loaded');

const repo = ReqRespMongoRepo.getInstance();
const controller = new ReqRespController(repo);

// ReqRespRouter.all('/*', controller.create.bind(controller));
controller.create.bind(controller);
