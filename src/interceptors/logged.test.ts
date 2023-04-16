import { Response } from 'express';
import { logged, RequestPlus } from '../interceptors/logged';
import { Auth } from '../services/auth';
import { HTTPError } from '../interfaces/error';

jest.mock('../services/auth');

describe('Given a logged interceptor', () => {
  const req = {
    body: {},
    params: { id: '' },
    get: jest.fn(),
  } as unknown as RequestPlus;
  const resp = {
    json: jest.fn(),
  } as unknown as Response;
  const next = jest.fn();

  describe('When is used', () => {
    test('Then it should send next if there are NOT Authorization header ', () => {
      (req.get as jest.Mock).mockReturnValue(null);
      logged(req, resp, next);
      expect(next).toHaveBeenLastCalledWith(expect.any(HTTPError));
    });
    test('Then it should send next if Authorization header is BAD formatted', () => {
      (req.get as jest.Mock).mockReturnValue('BAD token');
      logged(req, resp, next);
      expect(next).toHaveBeenLastCalledWith(expect.any(HTTPError));
    });
    test('Then it should send next if Authorization token is NOT valid', () => {
      Auth.verifyJWTGettingPayload = jest.fn().mockReturnValue('Invalid token');
      logged(req, resp, next);
      expect(next).toHaveBeenLastCalledWith(expect.any(Error));
    });
    test('Then it should send next if Authorization token is valid', () => {
      (req.get as jest.Mock).mockReturnValue('Bearer token');
      Auth.verifyJWTGettingPayload = jest.fn().mockReturnValue({});
      logged(req, resp, next);
      expect(next).toHaveBeenLastCalledWith();
    });
  });
});
