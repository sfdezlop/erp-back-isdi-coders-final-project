import { Router } from 'express';

import createDebug from 'debug';
import { logged } from '../interceptors/logged.js';
import { CollectionsMongoRepo } from '../repositories/collections.mongo.repo.js';
import { CollectionsController } from '../controllers/collections.controller.js';
const debug = createDebug('ERP:router:collections');

// eslint-disable-next-line new-cap
export const collectionsRouter = Router();
debug('loaded');

const repo = CollectionsMongoRepo.getInstance();
const controller = new CollectionsController(repo);

collectionsRouter.get('/read/:id', logged, controller.read.bind(controller));
collectionsRouter.get(
  '/groupby/:id',
  logged,
  controller.groupBy.bind(controller)
);
