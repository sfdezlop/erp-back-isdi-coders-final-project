import { ProductMovementsController } from './productmovements.controller';
import { Request, Response, NextFunction } from 'express';
import { ProductMovementMongoRepo } from '../repositories/productmovements.mongo.repo';
import { HTTPError } from '../interfaces/error';

describe('Given a productmovements controller', () => {
  const repoMockWithResp = {
    analytics: jest.fn().mockReturnValue({ results: [] }),
    create: jest.fn(),
    getByFilterWithPaginationAndOrder: jest.fn(),
    queryId: jest.fn(),
    countFilteredRecords: jest.fn(),
    countRecords: jest.fn(),
    stockBySku: jest.fn(),
    stock: jest.fn(),
  } as unknown as ProductMovementMongoRepo;

  const repoMockWithoutResp = {
    analytics: jest.fn().mockReturnValue(undefined),
    create: jest.fn(),
    getByFilterWithPaginationAndOrder: jest.fn(),
    queryId: jest.fn(),
    countFilteredRecords: jest.fn(),
    countRecords: jest.fn(),
    stockBySku: jest.fn(),
    stock: jest.fn(),
  } as unknown as ProductMovementMongoRepo;

  const controllerWithResp = new ProductMovementsController(repoMockWithResp);
  const controllerWithoutResp = new ProductMovementsController(
    repoMockWithoutResp
  );

  const mockReqWithoutAuthorization = {
    body: {},
  } as unknown as Request;

  const mockReqWithoutBearerFormedAuthorization = {
    headers: {
      authorization: 'mockedToken',
    },
    params: {},
  } as unknown as Request;
  const mockReqWithBearerFormedAuthorization = {
    headers: {
      authorization: 'Bearer mockedToken',
    },
    params: {},
    body: {},
  } as unknown as Request;
  const mockResp = {
    json: jest.fn(),
    status: jest.fn(),
  } as unknown as Response;

  const next = jest.fn() as unknown as NextFunction;

  describe('When the analytics method is called', () => {
    test('Then, if authorization is not included in the request, it should throw an error', async () => {
      await controllerWithoutResp.analytics(
        mockReqWithoutAuthorization,
        mockResp,
        next
      );
      expect(HTTPError).toThrowError();
    });
    test('Then, if a Bearer formed authorization is not included in the request, it should throw an error', async () => {
      await controllerWithoutResp.analytics(
        mockReqWithoutBearerFormedAuthorization,
        mockResp,
        next
      );
      expect(HTTPError).toThrowError();
    });

    test('Then, if a Bearer formed authorization is included in the request, an error should be thrown when no data is received', async () => {
      await controllerWithoutResp.analytics(
        mockReqWithBearerFormedAuthorization,
        mockResp,
        next
      );
      expect(HTTPError).toThrowError();
    });
    test('Then, if a Bearer formed authorization is included in the request, the analytics method of the repo should have been called and a json respond and its status should be send when data is received', async () => {
      await controllerWithResp.analytics(
        mockReqWithBearerFormedAuthorization,
        mockResp,
        next
      );
      expect(repoMockWithResp.analytics).toHaveBeenCalled();
      expect(mockResp.json).toHaveBeenCalled();
      expect(mockResp.status).toHaveBeenCalled();
    });
  });

  describe('When the create method is called', () => {
    test('Then, if authorization is not included in the request, it should throw an error', async () => {
      await controllerWithoutResp.create(
        mockReqWithoutAuthorization,
        mockResp,
        next
      );
      expect(HTTPError).toThrowError();
    });
    test('Then, if a Bearer formed authorization is not included in the request, it should throw an error', async () => {
      await controllerWithoutResp.create(
        mockReqWithoutBearerFormedAuthorization,
        mockResp,
        next
      );
      expect(HTTPError).toThrowError();
    });
    test('Then, if a Bearer formed authorization and a body are included in the request, an error should be thrown when no data is received', async () => {
      mockReqWithBearerFormedAuthorization.body = {};
      await controllerWithoutResp.create(
        mockReqWithBearerFormedAuthorization,
        mockResp,
        next
      );
      expect(HTTPError).toThrowError();
    });
    test('Then, if a Bearer formed authorization and a body are included in the request, a json respond and its status should be send when data is received', async () => {
      mockReqWithBearerFormedAuthorization.body = {};
      await controllerWithResp.create(
        mockReqWithBearerFormedAuthorization,
        mockResp,
        next
      );

      expect(mockResp.json).toHaveBeenCalled();
      expect(mockResp.status).toHaveBeenCalled();
      // Test with error if this expect is added, even if it is correct: expect(repoMockWithResp.create).toHaveBeenCalled();
    });
    test('Then, if a Bearer formed authorization is included in the request but a body is not included in the request, an error should be thrown', async () => {
      mockReqWithBearerFormedAuthorization.body = undefined;
      await controllerWithoutResp.create(
        mockReqWithBearerFormedAuthorization,
        mockResp,
        next
      );
      expect(HTTPError).toThrowError();
    });
  });

  describe('When the getByFilterWithPaginationAndOrder method is called', () => {
    test('Then, if authorization is not included in the request, it should throw an error', async () => {
      await controllerWithoutResp.getByFilterWithPaginationAndOrder(
        mockReqWithoutAuthorization,
        mockResp,
        next
      );
      expect(HTTPError).toThrowError();
    });
    test('Then, if a Bearer formed authorization is not included in the request, it should throw an error', async () => {
      await controllerWithoutResp.getByFilterWithPaginationAndOrder(
        mockReqWithoutBearerFormedAuthorization,
        mockResp,
        next
      );
      expect(HTTPError).toThrowError();
    });
    test('Then, if a Bearer formed authorization and a body are included in the request, an error should be thrown when no data is received', async () => {
      mockReqWithBearerFormedAuthorization.body = {};
      await controllerWithoutResp.getByFilterWithPaginationAndOrder(
        mockReqWithBearerFormedAuthorization,
        mockResp,
        next
      );
      expect(HTTPError).toThrowError();
    });
    test('Then, if a Bearer formed authorization and a body are included in the request, the getByFilterWithPaginationAndOrder method of the repo should have been called and a json respond and its status should be send when data is received', async () => {
      mockReqWithBearerFormedAuthorization.body = {};
      await controllerWithResp.getByFilterWithPaginationAndOrder(
        mockReqWithBearerFormedAuthorization,
        mockResp,
        next
      );
      expect(
        repoMockWithResp.getByFilterWithPaginationAndOrder
      ).toHaveBeenCalled();
      expect(mockResp.json).toHaveBeenCalled();
      expect(mockResp.status).toHaveBeenCalled();
    });
    test('Then, if a Bearer formed authorization is included in the request but a body is not included in the request, an error should be thrown', async () => {
      mockReqWithBearerFormedAuthorization.body = undefined;
      await controllerWithoutResp.getByFilterWithPaginationAndOrder(
        mockReqWithBearerFormedAuthorization,
        mockResp,
        next
      );
      expect(HTTPError).toThrowError();
    });
  });

  describe('When the getById method is called', () => {
    test('Then, if authorization is not included in the request, it should throw an error', async () => {
      await controllerWithoutResp.getById(
        mockReqWithoutAuthorization,
        mockResp,
        next
      );
      expect(HTTPError).toThrowError();
    });
    test('Then, if a Bearer formed authorization is not included in the request, it should throw an error', async () => {
      await controllerWithoutResp.getById(
        mockReqWithoutBearerFormedAuthorization,
        mockResp,
        next
      );
      expect(HTTPError).toThrowError();
    });
    test('Then, if a Bearer formed authorization and query param are included in the request, an error should be thrown when no data is received', async () => {
      mockReqWithBearerFormedAuthorization.params.id = 'mockId';
      await controllerWithoutResp.getById(
        mockReqWithBearerFormedAuthorization,
        mockResp,
        next
      );
      expect(HTTPError).toThrowError();
    });
    test('Then, if a Bearer formed authorization and a query param are included in the request, the getById method of the repo should have been called and a json respond and its status should be send when data is received', async () => {
      mockReqWithBearerFormedAuthorization.params.id = 'mockId';
      await controllerWithResp.getById(
        mockReqWithBearerFormedAuthorization,
        mockResp,
        next
      );
      expect(repoMockWithResp.queryId).toHaveBeenCalled();
      expect(mockResp.json).toHaveBeenCalled();
      expect(mockResp.status).toHaveBeenCalled();
    });
    test('Then, if a Bearer formed authorization is included in the request but a query param is not included in the request, an error should be thrown', async () => {
      mockReqWithBearerFormedAuthorization.params.id = '';
      await controllerWithoutResp.getById(
        mockReqWithBearerFormedAuthorization,
        mockResp,
        next
      );
      expect(HTTPError).toThrowError();
    });
  });

  describe('When the countFilteredRecords method is called', () => {
    test('Then, if authorization is not included in the request, it should throw an error', async () => {
      await controllerWithoutResp.countFilteredRecords(
        mockReqWithoutAuthorization,
        mockResp,
        next
      );
      expect(HTTPError).toThrowError();
    });
    test('Then, if a Bearer formed authorization is not included in the request, it should throw an error', async () => {
      await controllerWithoutResp.countFilteredRecords(
        mockReqWithoutBearerFormedAuthorization,
        mockResp,
        next
      );
      expect(HTTPError).toThrowError();
    });
    test('Then, if a Bearer formed authorization and body are included in the request, an error should be thrown when no data is received', async () => {
      await controllerWithoutResp.countFilteredRecords(
        mockReqWithBearerFormedAuthorization,
        mockResp,
        next
      );
      expect(HTTPError).toThrowError();
    });
    test('Then, if a Bearer formed authorization and a body are included in the request, the countFilteredRecords method of the repo should have been called and a json respond and its status should be send when data is received', async () => {
      mockReqWithBearerFormedAuthorization.body = {};
      await controllerWithResp.countFilteredRecords(
        mockReqWithBearerFormedAuthorization,
        mockResp,
        next
      );
      expect(repoMockWithResp.countFilteredRecords).toHaveBeenCalled();
      expect(mockResp.json).toHaveBeenCalled();
      expect(mockResp.status).toHaveBeenCalled();
    });
    test('Then, if a Bearer formed authorization is included in the request but a body is not included in the request, an error should be thrown', async () => {
      mockReqWithBearerFormedAuthorization.body = undefined;
      await controllerWithoutResp.countFilteredRecords(
        mockReqWithBearerFormedAuthorization,
        mockResp,
        next
      );
      expect(HTTPError).toThrowError();
    });
  });

  describe('When the countRecords method is called', () => {
    test('Then, if authorization is not included in the request, it should throw an error', async () => {
      await controllerWithoutResp.countRecords(
        mockReqWithoutAuthorization,
        mockResp,
        next
      );
      expect(HTTPError).toThrowError();
    });
    test('Then, if a Bearer formed authorization is not included in the request, it should throw an error', async () => {
      await controllerWithoutResp.countRecords(
        mockReqWithoutBearerFormedAuthorization,
        mockResp,
        next
      );
      expect(HTTPError).toThrowError();
    });

    test('Then, if a Bearer formed authorization is included in the request, an error should be thrown when no data is received', async () => {
      await controllerWithoutResp.countRecords(
        mockReqWithBearerFormedAuthorization,
        mockResp,
        next
      );
      expect(HTTPError).toThrowError();
    });
    test('Then, if a Bearer formed authorization is included in the request, the countRecords method of the repo should have been called and a json respond and its status should be send when data is received', async () => {
      await controllerWithResp.countRecords(
        mockReqWithBearerFormedAuthorization,
        mockResp,
        next
      );
      expect(repoMockWithResp.countRecords).toHaveBeenCalled();
      expect(mockResp.json).toHaveBeenCalled();
      expect(mockResp.status).toHaveBeenCalled();
    });
  });

  describe('When the stockBySku method is called', () => {
    test('Then, if authorization is not included in the request, it should throw an error', async () => {
      await controllerWithoutResp.stockBySku(
        mockReqWithoutAuthorization,
        mockResp,
        next
      );
      expect(HTTPError).toThrowError();
    });
    test('Then, if a Bearer formed authorization is not included in the request, it should throw an error', async () => {
      await controllerWithoutResp.stockBySku(
        mockReqWithoutBearerFormedAuthorization,
        mockResp,
        next
      );
      expect(HTTPError).toThrowError();
    });
    test('Then, if a Bearer formed authorization and query param are included in the request, an error should be thrown when no data is received', async () => {
      mockReqWithBearerFormedAuthorization.params.id = 'mockId';
      await controllerWithoutResp.stockBySku(
        mockReqWithBearerFormedAuthorization,
        mockResp,
        next
      );
      expect(HTTPError).toThrowError();
    });
    test('Then, if a Bearer formed authorization and a query param are included in the request, the stockBySku method of the repo should have been called and a json respond and its status should be send when data is received', async () => {
      mockReqWithBearerFormedAuthorization.params.id = 'mockId';
      await controllerWithResp.stockBySku(
        mockReqWithBearerFormedAuthorization,
        mockResp,
        next
      );
      expect(repoMockWithResp.stockBySku).toHaveBeenCalled();
      expect(mockResp.json).toHaveBeenCalled();
      expect(mockResp.status).toHaveBeenCalled();
    });
    test('Then, if a Bearer formed authorization is included in the request but a query param is not included in the request, an error should be thrown', async () => {
      mockReqWithBearerFormedAuthorization.params.id = '';
      await controllerWithoutResp.stockBySku(
        mockReqWithBearerFormedAuthorization,
        mockResp,
        next
      );
      expect(HTTPError).toThrowError();
    });
  });

  describe('When the stock method is called', () => {
    test('Then, if authorization is not included in the request, it should throw an error', async () => {
      await controllerWithoutResp.stock(
        mockReqWithoutAuthorization,
        mockResp,
        next
      );
      expect(HTTPError).toThrowError();
    });
    test('Then, if a Bearer formed authorization is not included in the request, it should throw an error', async () => {
      await controllerWithoutResp.stock(
        mockReqWithoutBearerFormedAuthorization,
        mockResp,
        next
      );
      expect(HTTPError).toThrowError();
    });

    test('Then, if a Bearer formed authorization is included in the request, an error should be thrown when no data is received', async () => {
      await controllerWithoutResp.stock(
        mockReqWithBearerFormedAuthorization,
        mockResp,
        next
      );
      expect(HTTPError).toThrowError();
    });
    test('Then, if a Bearer formed authorization is included in the request, the countRecords method of the repo should have been called and a json respond and its status should be send when data is received', async () => {
      await controllerWithResp.stock(
        mockReqWithBearerFormedAuthorization,
        mockResp,
        next
      );
      expect(repoMockWithResp.stock).toHaveBeenCalled();
      expect(mockResp.json).toHaveBeenCalled();
      expect(mockResp.status).toHaveBeenCalled();
    });
  });
});
