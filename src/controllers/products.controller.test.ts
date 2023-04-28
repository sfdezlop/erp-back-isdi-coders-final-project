import { ProductsController } from './products.controller';
import { Request, Response, NextFunction } from 'express';
import { ProductsMongoRepo } from '../repositories/products.mongo.repo';
import { HTTPError } from '../interfaces/error';

describe('Given the product controller', () => {
  const repoMock = {
    getByFilterWithPaginationAndOrder: jest.fn(),
    queryId: jest.fn(),
    queryByKey: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    deleteById: jest.fn(),
    deleteByKey: jest.fn(),
    countFilteredRecords: jest.fn(),
    leftJoinProductMovements: jest.fn(),
    groupValuesPerField: jest.fn(),
    microserviceQueryByKeyValue: jest.fn(),
  } as unknown as ProductsMongoRepo;

  const repoMockWithoutResp = {
    getByFilterWithPaginationAndOrder: jest.fn().mockReturnValue(null),
    queryId: jest.fn().mockReturnValue(null),
    queryByKey: jest.fn().mockReturnValue(null),
    create: jest.fn().mockReturnValue(null),
    update: jest.fn().mockReturnValue(null),
    deleteById: jest.fn().mockReturnValue(null),
    deleteByKey: jest.fn().mockReturnValue(null),
    countFilteredRecords: jest.fn().mockReturnValue(null),
    leftJoinProductMovements: jest.fn().mockReturnValue(undefined),
    groupValuesPerField: jest.fn().mockReturnValue(null),
    microserviceQueryByKeyValue: jest.fn().mockReturnValue(undefined),
  } as unknown as ProductsMongoRepo;
  const controller = new ProductsController(repoMock);
  const controllerWithoutResp = new ProductsController(repoMockWithoutResp);
  const resp = {
    json: jest.fn(),
    status: jest.fn(),
  } as unknown as Response;

  const respKO = {
    json: jest.fn().mockReturnValue(undefined),
    status: jest.fn().mockReturnValue(undefined),
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

  describe('When the deleteById method is called', () => {
    test('Then, if everything is correct, the response should have results', async () => {
      await controller.deleteById(req, resp, next);
      expect(resp.json).toHaveBeenCalled();
    });
    test('Then, if there is not a correct body at the request, it should call next', async () => {
      const req = null as unknown as Request;
      await controller.deleteById(req, resp, next);
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
    test('Then, if there is no response, it should call next', async () => {
      await controllerWithoutResp.leftJoinProductMovements(req, respKO, next);
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

  describe('When the microserviceQueryByKeyValuePost method is called', () => {
    test('Then, if there is not a correct body at the request, it should call next', async () => {
      const req = null as unknown as Request;
      await controller.microserviceQueryByKeyValuePost(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
    test('Then, if there is not a correct bearer authorization at request headers, it should throw and error an call next', async () => {
      const mockReq = {
        headers: { authorization: 'notBearer' },
        body: {},
      } as unknown as Request;
      await controller.microserviceQueryByKeyValuePost(mockReq, resp, next);
      expect(next).toHaveBeenCalled();
      expect(HTTPError).toThrowError();
    });

    test('Then, if there is a correct bearer authorization at request headers but there is no id included in the request params, it should throw and error an call next', async () => {
      const mockReq = {
        headers: { authorization: 'Bearer ' },
        body: {},
        params: { id: null },
      } as unknown as Request;
      await controller.microserviceQueryByKeyValuePost(mockReq, resp, next);
      expect(next).toHaveBeenCalled();
      expect(HTTPError).toThrowError();
    });
    test('Then, if everything is correct, the response should have results', async () => {
      const mockReq = {
        headers: { authorization: 'Bearer ' },
        body: { outputKey: 'mockOutputKey' },
        params: { id: 'mockId', path: 'mockPath' },
      } as unknown as Request;

      await controller.microserviceQueryByKeyValuePost(mockReq, resp, next);
      expect(resp.json).toHaveBeenCalled();
      expect(resp.status).toHaveBeenCalled();
    });
  });

  describe('When the microserviceQueryByKeyValueGet method is called', () => {
    test('Then, if there is not a correct body at the request, it should call next', async () => {
      const req = null as unknown as Request;
      await controller.microserviceQueryByKeyValueGet(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
    test('Then, if there is not a correct bearer authorization at request headers, it should throw and error an call next', async () => {
      const mockReq = {
        headers: { authorization: 'notBearer' },
        body: {},
      } as unknown as Request;
      await controller.microserviceQueryByKeyValueGet(mockReq, resp, next);
      expect(next).toHaveBeenCalled();
      expect(HTTPError).toThrowError();
    });

    test('Then, if there is a correct bearer authorization at request headers but there is no id included in the request params, it should throw and error an call next', async () => {
      const mockReq = {
        headers: { authorization: 'Bearer ' },
        body: {},
        params: { id: null },
      } as unknown as Request;
      await controller.microserviceQueryByKeyValueGet(mockReq, resp, next);
      expect(next).toHaveBeenCalled();
      expect(HTTPError).toThrowError();
    });
    test('Then, if everything is correct at the request, the response should have results', async () => {
      const mockReq = {
        headers: { authorization: 'Bearer ' },
        body: { outputKey: 'mockOutputKey' },
        params: { id: 'mockId', path: 'mockPath' },
      } as unknown as Request;

      await controller.microserviceQueryByKeyValueGet(mockReq, resp, next);
      expect(resp.json).toHaveBeenCalled();
      expect(resp.status).toHaveBeenCalled();
    });
  });
});
