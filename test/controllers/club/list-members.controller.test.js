import { returnErrorResponse } from '../../../src/errors/error-response';
import MemberLogic from '../../../src/business-logic/member';
import listMembers from '../../../src/controllers/club/list-members.controller';

jest.mock('../../../src/errors/error-response');
jest.mock('../../../src/business-logic/member');

describe('Controller: Club: list members', () => {
  let req, res;

  beforeEach(() => {
    req = {
      userId: 'user-id',
      params: { clubId: 'club-id' },
    };
    res = {
      send: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return a list of members when successful', async () => {
    const mockMembers = ['Member1', 'Member2', 'Member3'];
    MemberLogic.listByClub.mockResolvedValue(mockMembers);
    await listMembers(req, res);
    expect(res.send).toHaveBeenCalledWith({ members: mockMembers });
  });

  it('should return an error when member logic fails', async () => {
    const mockError = new Error('Member error');
    MemberLogic.listByClub.mockRejectedValue(mockError);
    await listMembers(req, res);
    expect(returnErrorResponse).toHaveBeenCalledWith({ error: mockError, res });
  });
});
