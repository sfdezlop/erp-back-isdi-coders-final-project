import { ProductMovementsController } from './productmovements.controller';
import { Request, Response, NextFunction } from 'express';
import { ProductMovementMongoRepo } from '../repositories/productmovements.mongo.repo';
import { HTTPError } from '../interfaces/error';

describe('Given the productmovements controller', () => {
  const repoMock = {
    analytics: jest.fn(),
    getByFilterWithPaginationAndOrder: jest.fn(),
    queryId: jest.fn(),
    countFilteredRecords: jest.fn(),
    countRecords: jest.fn(),
  } as unknown as ProductMovementMongoRepo;

  const controller = new ProductMovementsController(repoMock);

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

  describe('When the analytics method is called', () => {
    test('Then, if everything is correct, the response should have results', async () => {
      await controller.analytics(req, resp, next);
      expect(resp.json).toHaveBeenCalled();
    });

    test('Then, if everything is correct, the analytics method of the repo should have been called', async () => {
      await controller.analytics(req, resp, next);
      expect(repoMock.analytics).toHaveBeenCalled();
    });
  });

  describe('When the getByFilterWithPaginationAndOrder method is called', () => {
    test('Then, if everything is correct, the response should have results', async () => {
      await controller.getByFilterWithPaginationAndOrder(req, resp, next);
      expect(resp.json).toHaveBeenCalled();
    });

    test('Then, if everything is correct, the analytics method of the repo should have been called', async () => {
      await controller.getByFilterWithPaginationAndOrder(req, resp, next);
      expect(repoMock.getByFilterWithPaginationAndOrder).toHaveBeenCalled();
    });
  });

  describe('When the getById method is called', () => {
    test('Then, if everything is correct, the response should have results', async () => {
      await controller.getById(req, resp, next);
      expect(resp.json).toHaveBeenCalled();
    });

    test('Then, if everything is correct, the queryId method of the repo should have been called', async () => {
      await controller.getById(req, resp, next);
      expect(repoMock.queryId).toHaveBeenCalled();
    });
  });

  describe('When the countFilteredRecords method is called', () => {
    test('Then, if everything is correct, the response should have results', async () => {
      await controller.countFilteredRecords(req, resp, next);
      expect(resp.json).toHaveBeenCalled();
    });

    test('Then, if everything is correct, the queryId method of the repo should have been called', async () => {
      await controller.countFilteredRecords(req, resp, next);
      expect(repoMock.countFilteredRecords).toHaveBeenCalled();
    });
  });

  describe('When the countRecords method is called', () => {
    test('Then, if everything is correct, the response should have results', async () => {
      await controller.countRecords(req, resp, next);
      expect(resp.json).toHaveBeenCalled();
    });

    test('Then, if everything is correct, the queryId method of the repo should have been called', async () => {
      await controller.countRecords(req, resp, next);
      expect(repoMock.countRecords).toHaveBeenCalled();
    });
  });

  describe('When the countRecords method is called', () => {
    test('Then, if everything is correct, the response should have results', async () => {
      await controller.countRecords(req, resp, next);
      expect(resp.json).toHaveBeenCalled();
    });

    test('Then, if everything is correct, the queryId method of the repo should have been called', async () => {
      await controller.countRecords(req, resp, next);
      expect(repoMock.countRecords).toHaveBeenCalled();
    });
  });
});
