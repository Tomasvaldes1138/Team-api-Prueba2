import { expect, jest } from '@jest/globals';
import HTTPError from '../../src/errors/http.error';
import authMiddleware from '../../src/middlewares/auth.middleware';
import { verifyToken } from '../../src/utils/jwt.util';

jest.mock('../../src/utils/jwt.util', () => ({
  verifyToken: jest.fn(),
}));

describe('Middleware: Auth: Auth token', () => {
  let res, req;

  const mockRequest = (headers) => ({
    headers,
  });

  beforeEach(() => {
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

  });


  afterEach(() => {
    jest.resetAllMocks();
  }); 

  it('Should return a 401 error when the authorization header is not present', async () => {
     req = mockRequest({});

    await authMiddleware(req, res);


    expect(res.status).toBeCalledWith(401);
    expect(res.send).toBeCalledWith({
      error: expect.objectContaining({
        name: 'auhtorization_token_is_required',
        message: 'the authorization header is needed and the token',
        statusCode: 401,
      }),

    });

  });

  it('Should return a 401 error when the authorization header is present but the token is missing', async () => {
     req = mockRequest({ Authorization: 'Bearer ' });
    try {
      await authMiddleware(req, res);
    } catch (error) {
      expect(res.status).toBeCalledWith(401);
      expect(res.send).toBeCalledWith({
        error: expect.objectContaining({
          name: 'auhtorization_token_is_required',
          message: 'the authorization header is needed and the token',
          statusCode: 401,
        }),
      });
    }
  });

  it('Should return a 401 error when the token is invalid', async () => {
     req = mockRequest({ Authorization: 'Bearer invalid-token' });

    verifyToken.mockImplementation(() => {
      throw new Error('invalid token');
    });
    try {
      await authMiddleware(req, res);
    } catch (error) {
      expect(res.status).toBeCalledWith(401);
      expect(res.send).toBeCalledWith({
        error: expect.objectContaining({
          name: 'invalid_token',
          message: 'invalid token',
          statusCode: 401,
        }),
      });
    }
  });

  it('Should set the userId in the request object when the token is valid', async () => {
     req =  mockRequest({ Authorization: 'Bearer valid-token' });

    verifyToken.mockReturnValue({ userId: 'user-id' });

    const next = jest.fn();

    await authMiddleware(req, res, next);

    expect(req.userId).toBe('user-id');
    expect(next).toBeCalled();
  });
});