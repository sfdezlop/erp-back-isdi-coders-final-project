import { Router } from 'express';
import { ProductMovementsController } from '../controllers/productmovements.controller.js';
import { ProductMovementMongoRepo } from '../repositories/productmovements.mongo.repo.js';
import createDebug from 'debug';
import { logged } from '../interceptors/logged.js';
const debug = createDebug('ERP:router:products');

// eslint-disable-next-line new-cap
export const productMovementsRouter = Router();
debug('loaded');

const repo = ProductMovementMongoRepo.getInstance();
const controller = new ProductMovementsController(repo);

productMovementsRouter.post(
  '/count',
  logged,

  controller.countFilteredRecords.bind(controller)
);

productMovementsRouter.get(
  '/analytics',
  logged,
  controller.analytics.bind(controller)
);

productMovementsRouter.post(
  '/gallery',
  logged,

  controller.getByFilterWithPaginationAndOrder.bind(controller)
);

productMovementsRouter.get(
  '/:id',
  logged,

  controller.getById.bind(controller)
);
