import { ReqRespController } from './reqresp.controller';
import { Request, Response, NextFunction } from 'express';
import { ReqRespMongoRepo } from '../repositories/reqresp.mongo.repo';

describe('Given the reqresp controller', () => {
  const repoMock = {
    create: jest.fn(),
    query: jest.fn(),
  } as unknown as ReqRespMongoRepo;

  const controller = new ReqRespController(repoMock);

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

  describe('When the create method is called', () => {
    test('Then, if everything is correct, the response should have results', async () => {
      await controller.create(req, resp, next);
      expect(resp.json).toHaveBeenCalled();
    });

    test('Then, if everything is correct, the create method of the repo should have been called', async () => {
      await controller.create(req, resp, next);
      expect(repoMock.create).toHaveBeenCalled();
    });
  });

  describe('When the query method is called', () => {
    test('Then, if everything is correct, the response should have results', async () => {
      await controller.query(req, resp, next);
      expect(resp.json).toHaveBeenCalled();
    });

    test('Then, if everything is correct, the query method of the repo should have been called', async () => {
      await controller.query(req, resp, next);
      expect(repoMock.query).toHaveBeenCalled();
    });
  });
});
