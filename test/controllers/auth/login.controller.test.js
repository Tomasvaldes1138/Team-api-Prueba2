import { returnErrorResponse } from '../../../src/errors/error-response';
import AuthLogic from '../../../src/business-logic/auth';
import { loginValidation } from '../../../src/validations/auth.validations';
import login from '../../../src/controllers/auth/login.controller';

jest.mock('../../../src/errors/error-response');
jest.mock('../../../src/business-logic/auth');
jest.mock('../../../src/validations/auth.validations');

describe('Controller: Auth: Login', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: { username: 'test', password: 'password' },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return a token when login is successful', async () => {
    const mockToken = 'mockToken';
    AuthLogic.login.mockResolvedValue(mockToken);
    await login(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({ token: mockToken });
  });

  it('Should return an error when email is not defined', async () => {
    req.body.email = undefined;
    const mockError = new Error('Email is required');
    loginValidation.validateAsync.mockImplementation(() => {
      throw mockError;
    });
    await login(req, res);
    expect(returnErrorResponse).toHaveBeenCalledWith({ error: mockError, res });
  });

  it('Should return an error when password is not defined', async () => {
    req.body.password = undefined;
    const mockError = new Error('Password is required');
    loginValidation.validateAsync.mockImplementation(() => {
      throw mockError;
    });
    await login(req, res);
    expect(returnErrorResponse).toHaveBeenCalledWith({ error: mockError, res });
  });

  it('should return an error when login validation fails', async () => {
    const mockError = new Error('Validation error');
    loginValidation.validateAsync.mockRejectedValue(mockError);
    await login(req, res);
    expect(returnErrorResponse).toHaveBeenCalledWith({ error: mockError, res });
  });

});
