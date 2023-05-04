import { Router } from 'express';
import { UsersController } from '../controllers/users.controller.js';
import { UsersMongoRepo } from '../repositories/users.mongo.repo.js';
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

collectionsRouter.get('/read/:id', controller.read.bind(controller));
collectionsRouter.get('/groupby/:id', controller.groupBy.bind(controller));
