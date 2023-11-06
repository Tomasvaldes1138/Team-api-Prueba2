import isAdminMiddleware from '../../src/middlewares/is-admin.middleware';
import UserModel from '../../src/models/user/user.model';
import HTTPError from '../../src/errors/http.error';
import { returnErrorResponse } from '../../src/errors/error-response';

jest.mock('../../src/models/user/user.model');
jest.mock('../../src/errors/error-response');

describe('Middleware: Auth: is-admin', () => {
    let req, res, next, mockUser;

    beforeEach(() => {
        req = {
            userId: '123',
        };
        res = {};
        next = jest.fn();
        mockUser = {
            select: jest.fn().mockReturnThis(),
            findById: jest.fn().mockReturnThis(),
        };
        UserModel.findById.mockReturnValue(mockUser);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should call next when user is admin', async () => {
        try {
            mockUser.select.mockResolvedValue({ isAdmin: true });
            await isAdminMiddleware(req, res, next);
        } catch (error) {
            expect(next).toHaveBeenCalled();
            expect(returnErrorResponse).not.toHaveBeenCalled();
        }


    });

    it('should return error when user is not admin', async () => {
        try {
            mockUser.select.mockResolvedValue({ isAdmin: false });
            await isAdminMiddleware(req, res, next);
        } catch (error) {
            expect(next).not.toHaveBeenCalled();
            expect(returnErrorResponse).toHaveBeenCalledWith({
                error: expect.any(HTTPError),
                res,
            });
            expect(returnErrorResponse).toHaveBeenCalledTimes(1);
        }


    });

    it('should return error when an exception is thrown', async () => {
        try {
            mockUser.select.mockImplementation(() => {
                throw new Error('Test error');
            });
            await isAdminMiddleware(req, res, next);
        } catch (error) {
            expect(next).not.toHaveBeenCalled();
            expect(returnErrorResponse).toHaveBeenCalledWith({
                error: expect.any(Error),
                res,
            });
            expect(returnErrorResponse).toHaveBeenCalledTimes(1);
        }
    });

});