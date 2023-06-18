import { CollectionsController } from './collections.controller';
import { Request, Response, NextFunction } from 'express';
import { CollectionsMongoRepo } from '../repositories/collections.mongo.repo';
import { HTTPError } from '../interfaces/error';

describe('Given the collection controller', () => {
  const repoMockWithResp = {
    calculate: jest.fn(),
    create: jest.fn(),
    groupBy: jest.fn(),
    groupBySet: jest.fn(),
    measure: jest.fn(),
    readRecords: jest.fn(),
    sample: jest.fn(),
    view: jest.fn(),
  } as unknown as CollectionsMongoRepo;

  const repoMockWithoutResp = {
    calculate: jest.fn().mockReturnValue(null),
    create: jest.fn().mockReturnValue(null),
    groupBy: jest.fn().mockReturnValue(null),
    groupBySet: jest.fn().mockReturnValue(null),
    measure: jest.fn().mockReturnValue(null),
    readRecords: jest.fn().mockReturnValue(null),
    sample: jest.fn().mockReturnValue(null),
    view: jest.fn().mockReturnValue(null),
  } as unknown as CollectionsMongoRepo;
  const controllerWithResp = new CollectionsController(repoMockWithResp);
  const controllerWithoutResp = new CollectionsController(repoMockWithoutResp);

  const mockReqWithoutAuthorization = {
    params: { id: '' },
  } as unknown as Request;

  const mockReqWithoutBearerFormedAuthorization = {
    headers: {
      authorization: 'mockedToken',
    },
    params: { id: '' },
  } as unknown as Request;
  const mockReqWithBearerFormedAuthorization = {
    headers: {
      authorization: 'Bearer mockedToken',
    },
    params: { id: 'mockQuery' },
    body: { id: 'mockId' },
  } as unknown as Request;
  const mockResp = {
    json: jest.fn(),
    status: jest.fn(),
  } as unknown as Response;

  const next = jest.fn() as unknown as NextFunction;

  describe('When the calculate method is called', () => {
    test('Then, if authorization is not included in the request, it should throw an error', async () => {
      await controllerWithoutResp.calculate(
        mockReqWithoutAuthorization,
        mockResp,
        next
      );
      expect(HTTPError).toThrowError();
    });
    test('Then, if a Bearer formed authorization is not included in the request, it should throw an error', async () => {
      await controllerWithoutResp.calculate(
        mockReqWithoutBearerFormedAuthorization,
        mockResp,
        next
      );
      expect(HTTPError).toThrowError();
    });

    test('Then, if a Bearer formed authorization is included in the request, an error should be thrown when no data is received', async () => {
      await controllerWithoutResp.calculate(
        mockReqWithBearerFormedAuthorization,
        mockResp,
        next
      );
      expect(HTTPError).toThrowError();
    });
    test('Then, if a Bearer formed authorization is included in the request, the calculate method of the repo should have been called and a json respond and its status should be send when data is received', async () => {
      await controllerWithResp.calculate(
        mockReqWithBearerFormedAuthorization,
        mockResp,
        next
      );
      expect(repoMockWithResp.calculate).toHaveBeenCalled();
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

    test('Then, if a Bearer formed authorization is included in the request, an error should be thrown when no data is received', async () => {
      await controllerWithoutResp.create(
        mockReqWithBearerFormedAuthorization,
        mockResp,
        next
      );
      expect(HTTPError).toThrowError();
    });
    test('Then, if a Bearer formed authorization is included in the request, the create method of the repo should have been called and a json respond and its status should be send when data is received', async () => {
      await controllerWithResp.create(
        mockReqWithBearerFormedAuthorization,
        mockResp,
        next
      );
      expect(repoMockWithResp.create).toHaveBeenCalled();
      expect(mockResp.json).toHaveBeenCalled();
      expect(mockResp.status).toHaveBeenCalled();
    });
  });

  describe('When the groupBy method is called', () => {
    test('Then, if authorization is not included in the request, it should throw an error', async () => {
      await controllerWithoutResp.groupBy(
        mockReqWithoutAuthorization,
        mockResp,
        next
      );
      expect(HTTPError).toThrowError();
    });
    test('Then, if a Bearer formed authorization is not included in the request, it should throw an error', async () => {
      await controllerWithoutResp.groupBy(
        mockReqWithoutBearerFormedAuthorization,
        mockResp,
        next
      );
      expect(HTTPError).toThrowError();
    });

    test('Then, if a Bearer formed authorization is included in the request, an error should be thrown when no data is received', async () => {
      await controllerWithoutResp.groupBy(
        mockReqWithBearerFormedAuthorization,
        mockResp,
        next
      );
      expect(HTTPError).toThrowError();
    });
    test('Then, if a Bearer formed authorization is included in the request, the groupBy method of the repo should have been called and a json respond and its status should be send when data is received', async () => {
      await controllerWithResp.groupBy(
        mockReqWithBearerFormedAuthorization,
        mockResp,
        next
      );
      expect(repoMockWithResp.groupBy).toHaveBeenCalled();
      expect(mockResp.json).toHaveBeenCalled();
      expect(mockResp.status).toHaveBeenCalled();
    });
  });

  describe('When the groupBySet method is called', () => {
    test('Then, if authorization is not included in the request, it should throw an error', async () => {
      await controllerWithoutResp.groupBySet(
        mockReqWithoutAuthorization,
        mockResp,
        next
      );
      expect(HTTPError).toThrowError();
    });
    test('Then, if a Bearer formed authorization is not included in the request, it should throw an error', async () => {
      await controllerWithoutResp.groupBySet(
        mockReqWithoutBearerFormedAuthorization,
        mockResp,
        next
      );
      expect(HTTPError).toThrowError();
    });

    test('Then, if a Bearer formed authorization is included in the request, an error should be thrown when no data is received', async () => {
      await controllerWithoutResp.groupBySet(
        mockReqWithBearerFormedAuthorization,
        mockResp,
        next
      );
      expect(HTTPError).toThrowError();
    });
    test('Then, if a Bearer formed authorization is included in the request, the groupBySet method of the repo should have been called and a json respond and its status should be send when data is received', async () => {
      await controllerWithResp.groupBySet(
        mockReqWithBearerFormedAuthorization,
        mockResp,
        next
      );
      expect(repoMockWithResp.groupBySet).toHaveBeenCalled();
      expect(mockResp.json).toHaveBeenCalled();
      expect(mockResp.status).toHaveBeenCalled();
    });
  });

  describe('When the measure method is called', () => {
    test('Then, if authorization is not included in the request, it should throw an error', async () => {
      await controllerWithoutResp.measure(
        mockReqWithoutAuthorization,
        mockResp,
        next
      );
      expect(HTTPError).toThrowError();
    });
    test('Then, if a Bearer formed authorization is not included in the request, it should throw an error', async () => {
      await controllerWithoutResp.measure(
        mockReqWithoutBearerFormedAuthorization,
        mockResp,
        next
      );
      expect(HTTPError).toThrowError();
    });

    test('Then, if a Bearer formed authorization is included in the request, an error should be thrown when no data is received', async () => {
      await controllerWithoutResp.measure(
        mockReqWithBearerFormedAuthorization,
        mockResp,
        next
      );
      expect(HTTPError).toThrowError();
    });
    test('Then, if a Bearer formed authorization is included in the request, the measure method of the repo should have been called and a json respond and its status should be send when data is received', async () => {
      await controllerWithResp.measure(
        mockReqWithBearerFormedAuthorization,
        mockResp,
        next
      );
      expect(repoMockWithResp.measure).toHaveBeenCalled();
      expect(mockResp.json).toHaveBeenCalled();
      expect(mockResp.status).toHaveBeenCalled();
    });
  });

  describe('When the view method is called', () => {
    test('Then, if authorization is not included in the request, it should throw an error', async () => {
      await controllerWithoutResp.view(
        mockReqWithoutAuthorization,
        mockResp,
        next
      );
      expect(HTTPError).toThrowError();
    });
    test('Then, if a Bearer formed authorization is not included in the request, it should throw an error', async () => {
      await controllerWithoutResp.view(
        mockReqWithoutBearerFormedAuthorization,
        mockResp,
        next
      );
      expect(HTTPError).toThrowError();
    });

    test('Then, if a Bearer formed authorization is included in the request, an error should be thrown when no data is received', async () => {
      await controllerWithoutResp.view(
        mockReqWithBearerFormedAuthorization,
        mockResp,
        next
      );
      expect(HTTPError).toThrowError();
    });
    test('Then, if a Bearer formed authorization is included in the request, the view method of the repo should have been called and a json respond and its status should be send when data is received', async () => {
      await controllerWithResp.view(
        mockReqWithBearerFormedAuthorization,
        mockResp,
        next
      );
      expect(repoMockWithResp.view).toHaveBeenCalled();
      expect(mockResp.json).toHaveBeenCalled();
      expect(mockResp.status).toHaveBeenCalled();
    });
  });

  describe('When the readRecords method is called', () => {
    test('Then, if authorization is not included in the request, it should throw an error', async () => {
      await controllerWithoutResp.readRecords(
        mockReqWithoutAuthorization,
        mockResp,
        next
      );
      expect(HTTPError).toThrowError();
    });
    test('Then, if a Bearer formed authorization is not included in the request, it should throw an error', async () => {
      await controllerWithoutResp.readRecords(
        mockReqWithoutBearerFormedAuthorization,
        mockResp,
        next
      );
      expect(HTTPError).toThrowError();
    });

    test('Then, if a Bearer formed authorization is included in the request, an error should be thrown when no data is received', async () => {
      await controllerWithoutResp.readRecords(
        mockReqWithBearerFormedAuthorization,
        mockResp,
        next
      );
      expect(HTTPError).toThrowError();
    });
    test('Then, if a Bearer formed authorization is included in the request, the readRecords method of the repo should have been called and a json respond and its status should be send when data is received', async () => {
      await controllerWithResp.readRecords(
        mockReqWithBearerFormedAuthorization,
        mockResp,
        next
      );
      expect(repoMockWithResp.readRecords).toHaveBeenCalled();
      expect(mockResp.json).toHaveBeenCalled();
      expect(mockResp.status).toHaveBeenCalled();
    });
  });

  describe('When the sample method is called', () => {
    test('Then, if authorization is not included in the request, it should throw an error', async () => {
      await controllerWithoutResp.sample(
        mockReqWithoutAuthorization,
        mockResp,
        next
      );
      expect(HTTPError).toThrowError();
    });
    test('Then, if a Bearer formed authorization is not included in the request, it should throw an error', async () => {
      await controllerWithoutResp.sample(
        mockReqWithoutBearerFormedAuthorization,
        mockResp,
        next
      );
      expect(HTTPError).toThrowError();
    });

    test('Then, if a Bearer formed authorization is included in the request, an error should be thrown when no data is received', async () => {
      await controllerWithoutResp.sample(
        mockReqWithBearerFormedAuthorization,
        mockResp,
        next
      );
      expect(HTTPError).toThrowError();
    });
    test('Then, if a Bearer formed authorization is included in the request, the sample method of the repo should have been called and a json respond and its status should be send when data is received', async () => {
      await controllerWithResp.sample(
        mockReqWithBearerFormedAuthorization,
        mockResp,
        next
      );
      expect(repoMockWithResp.sample).toHaveBeenCalled();
      expect(mockResp.json).toHaveBeenCalled();
      expect(mockResp.status).toHaveBeenCalled();
    });
  });
});
