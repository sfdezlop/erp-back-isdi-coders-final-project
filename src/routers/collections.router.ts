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

collectionsRouter.get(
  '/calculations/:id',
  logged,
  controller.calculate.bind(controller)
);

collectionsRouter.post(
  '/create/:id',
  logged,
  controller.create.bind(controller)
);

collectionsRouter.get(
  '/groupby/:id',
  logged,
  controller.groupBy.bind(controller)
);
collectionsRouter.get(
  '/groupbyset/:id',
  logged,
  controller.groupBySet.bind(controller)
);

collectionsRouter.get(
  '/measures/:id',
  logged,
  controller.measure.bind(controller)
);

collectionsRouter.get(
  '/readrecords/:id',
  logged,
  controller.readRecords.bind(controller)
);
collectionsRouter.get('/sample', logged, controller.sample.bind(controller));
collectionsRouter.get('/views/:id', logged, controller.view.bind(controller));
