import jwt from 'jsonwebtoken';
import { generateToken, verifyToken } from '../../src/utils/jwt.util';

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
  verify: jest.fn(),
}));

describe('Utils: util: JWT functions', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should generate a token', () => {
    const mockData = { userId: 'user-id' };
    const mockToken = 'mockToken';
    jwt.sign.mockReturnValue(mockToken);
    const token = generateToken({ data: mockData });
    expect(jwt.sign).toHaveBeenCalledWith(mockData, expect.any(String), { expiresIn: expect.any(String) });
    expect(token).toBe(mockToken);
  });

  it('should verify a token', () => {
    const mockToken = 'mockToken';
    const mockDecodedData = { userId: 'user-id' };
    jwt.verify.mockReturnValue(mockDecodedData);
    const decodedData = verifyToken(mockToken);
    expect(jwt.verify).toHaveBeenCalledWith(mockToken, expect.any(String));
    expect(decodedData).toBe(mockDecodedData);
  });

  it('should throw an error when the token is invalid', () => {
    const mockToken = 'invalid-token';
    jwt.verify.mockImplementation(() => {
        throw new Error('invalid token');
    });
    expect(() => verifyToken(mockToken)).toThrow('invalid token');
});

});
