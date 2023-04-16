import { ProductsController } from './products.controller';
import { Request, Response, NextFunction } from 'express';
import { ProductsMongoRepo } from '../repositories/products.mongo.repo';

describe('Given the product controller', () => {
  const repoMock = {
    getByFilterWithPaginationAndOrder: jest.fn(),
    queryId: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    countFilteredRecords: jest.fn(),
  } as unknown as ProductsMongoRepo;

  const controller = new ProductsController(repoMock);

  const resp = {
    json: jest.fn(),
    status: jest.fn(),
  } as unknown as Response;

  const next = jest.fn() as unknown as NextFunction;

  const req = {
    body: {
      results: [],
    },
  } as unknown as Request;

  describe('When the getByFilterWithPagination method is called', () => {
    test('Then, if everything is correct, the response should have results', async () => {
      await controller.getByFilterWithPaginationAndOrder(req, resp, next);
      expect(resp.json).toHaveBeenCalled();
    });

    test('Then, if there is not a correct body at the request, it should call next', async () => {
      const req = null as unknown as Request;
      await controller.getByFilterWithPaginationAndOrder(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('When the getById method is called', () => {
    test('Then, if everything is correct, the response should have results', async () => {
      await controller.getById(req, resp, next);
      expect(resp.json).toHaveBeenCalled();
    });
    test('Then, if there is not a correct body at the request, it should call next', async () => {
      const req = null as unknown as Request;
      await controller.getById(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('When the create method is called', () => {
    test('Then, if everything is correct, the response should have results', async () => {
      await controller.create(req, resp, next);
      expect(resp.json).toHaveBeenCalled();
    });
    test('Then, if there is not a correct body at the request, it should call next', async () => {
      const req = null as unknown as Request;
      await controller.create(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('When the update method is called', () => {
    test('Then, if everything is correct, the response should have results', async () => {
      await controller.update(req, resp, next);
      expect(resp.json).toHaveBeenCalled();
    });
    test('Then, if there is not a correct body at the request, it should call next', async () => {
      const req = null as unknown as Request;

      await controller.update(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('When the delete method is called', () => {
    test('Then, if everything is correct, the response should have results', async () => {
      await controller.delete(req, resp, next);
      expect(resp.json).toHaveBeenCalled();
    });
    test('Then, if there is not a correct body at the request, it should call next', async () => {
      const req = null as unknown as Request;
      await controller.delete(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('When the countFilteredRecords method is called', () => {
    test('Then, if everything is correct, the response should have results', async () => {
      await controller.countFilteredRecords(req, resp, next);
      expect(resp.json).toHaveBeenCalled();
    });
    test('Then, if there is not a correct body at the request, it should call next', async () => {
      const req = null as unknown as Request;
      await controller.countFilteredRecords(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });
});
