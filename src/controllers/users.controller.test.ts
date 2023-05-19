import { UsersController } from './users.controller';
import { Request, Response, NextFunction } from 'express';
import { Auth } from '../services/auth';
import { HTTPError } from '../interfaces/error';
import { UsersMongoRepo } from '../repositories/users.mongo.repo';

jest.mock('../services/auth');

describe('Given the users controller', () => {
  const repoMock = {
    create: jest.fn(),
    search: jest.fn(),
    query: jest.fn(),
    countRecords: jest.fn(),
  } as unknown as UsersMongoRepo;

  const controller = new UsersController(repoMock);

  const resp = {
    json: jest.fn(),
    status: jest.fn(),
  } as unknown as Response;

  const next = jest.fn() as unknown as NextFunction;

  describe('When the register method is called', () => {
    test('Then, if an email is not included in the request, it should throw an error and call next function', async () => {
      const req = {
        body: {
          passwd: 'mock',
        },
      } as unknown as Request;

      await controller.register(req, resp, next);
      expect(next).toHaveBeenCalled();
      expect(HTTPError).toThrowError();
    });
    test('Then, if a passwd is not included in the request, it should throw an error and call next function', async () => {
      const req = {
        body: {
          email: 'mock',
        },
      } as unknown as Request;
      await controller.register(req, resp, next);
      expect(next).toHaveBeenCalled();
      expect(HTTPError).toThrowError();
    });

    test('Then, if a passwd and email are included in the request, but the email already exists in the collection, the search method of the repo should have been called and it should throw an error and call next function', async () => {
      const req = {
        body: {
          email: 'mock',
          passwd: 'mock',
        },
      } as unknown as Request;
      (repoMock.search as jest.Mock).mockReturnValue([0]);
      await controller.register(req, resp, next);
      expect(repoMock.search).toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
      expect(HTTPError).toThrowError();
    });
    test('Then, if a body with an email and passwd is included in the request, the search and the create methods of the repo should have been called and a json respond and its status should be send when data is received', async () => {
      const req = {
        body: {
          email: 'mock',
          passwd: 'mock',
        },
      } as unknown as Request;
      (repoMock.search as jest.Mock).mockReturnValue([]);
      await controller.register(req, resp, next);
      expect(repoMock.search).toHaveBeenCalled();
      expect(repoMock.create).toHaveBeenCalled();
      expect(resp.status).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });
  });

  describe('When the login method is called', () => {
    test('Then, if a passwd is not included in the request body, it should throw an error and call next function', async () => {
      const req = {
        body: {
          email: 'mock',
        },
      } as unknown as Request;

      await controller.login(req, resp, next);
      expect(next).toHaveBeenCalled();
      expect(HTTPError).toThrowError();
    });

    test('Then, if an email is not included in the request body, it should throw an error and call next function', async () => {
      const req = {
        body: {
          passwd: 'mock',
        },
      } as unknown as Request;

      await controller.login(req, resp, next);
      expect(next).toHaveBeenCalled();
      expect(HTTPError).toThrowError();
    });

    test('Then, if an email and a passwd are included in the request body, but the email does not already exist, the search method of the repo should has been call and it should throw an error and call next function', async () => {
      const req = {
        body: {
          email: 'mock',
          passwd: 'mock',
        },
      } as unknown as Request;
      (repoMock.search as jest.Mock).mockReturnValue(null);
      await controller.login(req, resp, next);
      expect(repoMock.search).toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
      expect(HTTPError).toThrowError();
    });
    test('Then, if an email and a passwd are included in the request body, the email already exist but the passwd is not correct, the search method of the repo should has been call and it should throw an error and call next function', async () => {
      const req = {
        body: {
          email: 'mock',
          passwd: 'mock',
        },
      } as unknown as Request;

      await controller.login(req, resp, next);
      (repoMock.search as jest.Mock).mockReturnValue(['Test']);
      Auth.compare = jest.fn().mockResolvedValue(false);

      expect(repoMock.search).toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
      expect(HTTPError).toThrowError();
    });

    test('Then, if an email and a passwd are included in the request body, the email already exist and the passwd is correct, the search method of the repo should has been call and json respond and its status should be send when data is received', async () => {
      const req = {
        body: {
          email: 'mock',
          passwd: 'mock',
        },
      } as unknown as Request;

      (repoMock.search as jest.Mock).mockReturnValue(['test']);
      Auth.compare = jest.fn().mockResolvedValue(true);
      await controller.login(req, resp, next);
      expect(repoMock.search).toHaveBeenCalled();
      expect(resp.status).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });
  });

  describe('When the loginWithToken method is called', () => {
    test('Then, if a token is not included in the request body, it should throw an error and call next function', async () => {
      const req = {
        body: {
          token: null,
        },
      } as unknown as Request;

      await controller.login(req, resp, next);
      expect(next).toHaveBeenCalled();
      expect(HTTPError).toThrowError();
    });

    test('Then, if a token is included in the request body, but it is not possible to extract an email from the payload related with this token (result of verifyJWTGettingPayload undefined), it should throw an error and call next function', async () => {
      const req = {
        body: {
          token: 'mock',
        },
      } as unknown as Request;
      (repoMock.search as jest.Mock).mockReturnValue(['test']);
      Auth.verifyJWTGettingPayload = jest.fn().mockResolvedValue(undefined);
      await controller.loginWithToken(req, resp, next);
      expect(next).toHaveBeenCalled();
      expect(HTTPError).toThrowError();
    });

    test('Then, if a token is included in the request body, but it is not possible to extract an email from the payload related with this token (result of verifyJWTGettingPayload without property email), it should throw an error and call next function', async () => {
      const req = {
        body: {
          token: 'mock',
        },
      } as unknown as Request;
      (repoMock.search as jest.Mock).mockReturnValue(['test']);
      Auth.verifyJWTGettingPayload = jest
        .fn()
        .mockResolvedValue({ otherProperty: '' });
      await controller.loginWithToken(req, resp, next);
      expect(next).toHaveBeenCalled();
      expect(HTTPError).toThrowError();
    });

    test('Then, if a token is included in the request body, it is possible to extract an email from the payload related with this token, but the email does not exist it should throw an error and call next function', async () => {
      const req = {
        body: {
          token: 'mock',
        },
      } as unknown as Request;

      Auth.verifyJWTGettingPayload = jest
        .fn()
        .mockResolvedValue({ email: 'mock' });
      (repoMock.search as jest.Mock).mockReturnValue(undefined);
      await controller.loginWithToken(req, resp, next);
      expect(next).toHaveBeenCalled();
      expect(HTTPError).toThrowError();
    });

    test('Then, if a token is included in the request body, it is possible to extract an email from the payload related with this token and the email exists, the search and the query methods of the repo should has been call and json respond and its status should be send when data is received', async () => {
      const req = {
        body: {
          token: 'mock',
        },
      } as unknown as Request;

      Auth.verifyJWTGettingPayload = jest
        .fn()
        .mockResolvedValue({ email: 'mock' });
      (repoMock.search as jest.Mock).mockReturnValue([{}]);
      (repoMock.query as jest.Mock).mockReturnValue(['mock']);
      Auth.createJWT = jest.fn().mockResolvedValue('mock');
      await controller.loginWithToken(req, resp, next);
      expect(repoMock.search).toHaveBeenCalled();
      expect(repoMock.query).toHaveBeenCalled();
      expect(resp.status).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });
  });

  describe('When the countRecords method is called', () => {
    const req = {} as unknown as Request;
    test('Then, if everything is correct, the response should have results', async () => {
      await controller.countRecords(req, resp, next);
      expect(resp.json).toHaveBeenCalled();
    });

    test('Then, if everything is correct, the countRecords method of the repo should have been called', async () => {
      await controller.countRecords(req, resp, next);
      expect(repoMock.countRecords).toHaveBeenCalled();
    });
  });

  describe('When the query method is called', () => {
    const req = {} as unknown as Request;
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
