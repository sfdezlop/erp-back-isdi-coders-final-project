import { ProductsController } from './products.controller';
import { Request, Response, NextFunction } from 'express';
import { ProductsMongoRepo } from '../repositories/products.mongo.repo';
import { error } from 'console';
import { HTTPError } from '../interfaces/error';

describe('Given the product controller', () => {
  const repoMock = {
    getByFilterWithPaginationAndOrder: jest.fn(),
    queryId: jest.fn(),
    queryByKey: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    deleteByKey: jest.fn(),
    countFilteredRecords: jest.fn(),
    leftJoinProductMovements: jest.fn(),
    groupValuesPerField: jest.fn(),
  } as unknown as ProductsMongoRepo;

  const controller = new ProductsController(repoMock);

  const resp = {
    json: jest.fn(),
    status: jest.fn(),
  } as unknown as Response;

  const next = jest.fn() as unknown as NextFunction;

  const req = {
    params: {
      path: '/',
      id: '1',
    },
    body: {
      id: '1',
      results: [],
    },
  } as unknown as Request;

  describe('When the getByFilterWithPagination method is called', () => {
    test('Then, if everything is correct, the response should have results', async () => {
      await controller.getByFilterWithPaginationAndOrder(req, resp, next);
      expect(resp.json).toHaveBeenCalled();
    });

    test('Then, if everything is correct, the getByFilterWithPaginationAndOrder method of the repo should have been called', async () => {
      await controller.getByFilterWithPaginationAndOrder(req, resp, next);
      expect(repoMock.getByFilterWithPaginationAndOrder).toHaveBeenCalled();
    });

    test('Then, if there is not a correct body at the request, it should call next', async () => {
      const req = null as unknown as Request;
      await controller.getByFilterWithPaginationAndOrder(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('When the getByKey method is called', () => {
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

  describe('When the getByKey method is called', () => {
    test('Then, if everything is correct, the response should have results', async () => {
      await controller.getByKey(req, resp, next);
      expect(resp.json).toHaveBeenCalled();
    });
    test('Then, if there is not a correct body at the request, it should call next', async () => {
      const req = null as unknown as Request;
      await controller.getByKey(req, resp, next);
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
    test('Then, if there is no id query at the request, it should call HTTPError', async () => {
      const req = {
        params: {
          path: '/',
          id: null,
        },
        body: {
          results: [],
        },
      } as unknown as Request;

      await controller.update(req, resp, next);
      expect(HTTPError).toThrowError();
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

  describe('When the deleteByKey method is called', () => {
    test('Then, if everything is correct, the response should have results', async () => {
      await controller.deleteByKey(req, resp, next);
      expect(resp.json).toHaveBeenCalled();
    });
    test('Then, if there is not a correct body at the request, it should call next', async () => {
      const req = null as unknown as Request;
      await controller.deleteByKey(req, resp, next);
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

  describe('When the leftJoinProductMovements method is called', () => {
    test('Then, if everything is correct, the response should have results', async () => {
      await controller.leftJoinProductMovements(req, resp, next);
      expect(resp.json).toHaveBeenCalled();
    });
    test('Then, if there is no request, it should call next and throw an error', async () => {
      const req = null as unknown as Request;
      await controller.leftJoinProductMovements(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('When the groupValuesPerField method is called', () => {
    test('Then, if everything is correct, the response should have results', async () => {
      await controller.groupValuesPerField(req, resp, next);
      expect(resp.json).toHaveBeenCalled();
    });
    test('Then, if there is not a correct body at the request, it should call next', async () => {
      const req = null as unknown as Request;
      await controller.groupValuesPerField(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });
});
