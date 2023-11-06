import { returnErrorResponse } from '../../../src/errors/error-response';
import MemberLogic from '../../../src/business-logic/member';
import { addValidation } from '../../../src/validations/member.validations';
import addMember from '../../../src/controllers/club/add-member.controller';

jest.mock('../../../src/errors/error-response');
jest.mock('../../../src/business-logic/member');
jest.mock('../../../src/validations/member.validations');

describe('Controller: Club: add member', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: { name: 'John Doe' },
            params: { clubId: 'club-id' },
            userId: 'user-id',
        };
        res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return a member when creation is successful', async () => {
        const mockMember = { id: 'member-id', name: 'John Doe' };
        MemberLogic.create.mockResolvedValue(mockMember);
        await addMember(req, res);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.send).toHaveBeenCalledWith({ member: mockMember });
    });

    it('should return an error when member validation fails', async () => {
        const mockError = new Error('Validation error');
        addValidation.validateAsync.mockRejectedValue(mockError);
        await addMember(req, res);
        expect(returnErrorResponse).toHaveBeenCalledWith({ error: mockError, res });
    });

});
