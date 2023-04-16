import { UsersController } from './users.controller';
import { Request, Response, NextFunction } from 'express';
import { User } from '../entities/user.entity';
import { Repo } from '../repositories/repo.interface';
import { Auth } from '../services/auth';
import { HTTPError } from '../interfaces/error';

jest.mock('../services/auth');

describe('Given the user controller', () => {
  const mockPassword = 'test';

  const repoMock = {
    create: jest.fn(),
    search: jest.fn(),
    query: jest.fn(),
    countRecords: jest.fn(),
  } as unknown as Repo<User>;

  const controller = new UsersController(repoMock);

  const resp = {
    json: jest.fn(),
    status: jest.fn(),
  } as unknown as Response;

  const next = jest.fn() as unknown as NextFunction;

  describe('When the register method is called', () => {
    test('Then, if everything is correct, the response should be ok', async () => {
      const req = {
        body: {
          email: 'thisIsATest@test.com',
          passwd: mockPassword,
        },
      } as unknown as Request;

      await controller.register(req, resp, next);
      expect(repoMock.create).toHaveBeenCalled();
      expect(resp.status).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });

    test('When the email or password are wrong, it should call the next function', async () => {
      const req = {
        body: {
          password: mockPassword,
        },
      } as unknown as Request;

      await controller.register(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('When the login method is called', () => {
    test('Then, if all its correct, it should return the data', async () => {
      const req = {
        body: {
          email: 'thisIsATest@test.com',
          passwd: mockPassword,
        },
      } as unknown as Request;

      await controller.login(req, resp, next);
      (repoMock.search as jest.Mock).mockReturnValue(['Test']);
      Auth.compare = jest.fn().mockResolvedValue(true);

      expect(repoMock.search).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
      expect(resp.status).toHaveBeenCalled();
    });
    test('Then, if there is no email, it should return next function and throw an error', async () => {
      const req = {
        body: {
          password: mockPassword,
        },
      } as unknown as Request;
      await controller.login(req, resp, next);
      expect(next).toHaveBeenCalled();
      expect(HTTPError).toThrowError();
    });
    test('Then, if there is no password, it should return the next function and throw an error', async () => {
      const req = {
        body: {
          email: 'ThisIsAtest@test.com',
        },
      } as unknown as Request;

      await controller.login(req, resp, next);
      expect(next).toHaveBeenCalled();
      expect(HTTPError).toThrowError();
    });
    test('Then, if you give the search method empty, it should call next function and throw an error', async () => {
      const req = {
        body: {
          email: 'ThisIsATest@test.com',
          password: mockPassword,
        },
      } as unknown as Request;
      (repoMock.search as jest.Mock).mockReturnValue([]);
      await controller.login(req, resp, next);
      expect(next).toHaveBeenCalled();
      expect(HTTPError).toThrowError();
    });
    test('Then if you give the incorrect password, the Auth method gives false as return and throw an error', async () => {
      const req = {
        body: {
          email: 'ThisIsATest@test.com',
          password: mockPassword,
        },
      } as unknown as Request;

      (repoMock.search as jest.Mock).mockReturnValue(['test']);
      Auth.compare = jest.fn().mockResolvedValue(false);
      await controller.login(req, resp, next);

      expect(next).toHaveBeenCalled();
      expect(HTTPError).toThrowError();
    });
  });

  describe('When the loginWithToken method is called', () => {
    const req = {} as unknown as Request;
    test('Then, if everything is correct, the response should have results', async () => {
      await controller.loginWithToken(req, resp, next);
      expect(resp.json).toHaveBeenCalled();
    });

    test('Then, if everything is correct, the search method of the repo should have been called', async () => {
      await controller.loginWithToken(req, resp, next);
      expect(repoMock.search).toHaveBeenCalled();
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
