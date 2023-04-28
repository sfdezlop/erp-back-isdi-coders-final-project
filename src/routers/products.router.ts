import { Router } from 'express';
import { ProductsController } from '../controllers/products.controller.js';
import { ProductsMongoRepo } from '../repositories/products.mongo.repo.js';
import createDebug from 'debug';
import { logged } from '../interceptors/logged.js';
const debug = createDebug('ERP:router:products');

// eslint-disable-next-line new-cap
export const productsRouter = Router();
debug('loaded');

const repo = ProductsMongoRepo.getInstance();
const controller = new ProductsController(repo);

productsRouter.post(
  '/gallery',
  logged,

  controller.getByFilterWithPaginationAndOrder.bind(controller)
);
productsRouter.get(
  '/left-join-productmovements',
  controller.leftJoinProductMovements.bind(controller)
);
productsRouter.post(
  '/count',
  logged,

  controller.countFilteredRecords.bind(controller)
);

productsRouter.post(
  '/group-values-per-field/:id',
  logged,
  controller.groupValuesPerField.bind(controller)
);

productsRouter.post(
  '/microservices/:path/:id',
  logged,
  controller.microserviceQueryByKeyValuePost.bind(controller)
);
productsRouter.get(
  '/microservices/:path/:id',
  logged,
  controller.microserviceQueryByKeyValueGet.bind(controller)
);
productsRouter.post('/', logged, controller.create.bind(controller));
productsRouter.get('/:path/:id', logged, controller.getByKey.bind(controller));
productsRouter.get('/:id', logged, controller.getById.bind(controller));
productsRouter.delete('/:id', logged, controller.deleteById.bind(controller));
