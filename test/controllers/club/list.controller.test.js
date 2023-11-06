import { returnErrorResponse } from '../../../src/errors/error-response';
import ClubLogic from '../../../src/business-logic/club';
import list from '../../../src/controllers/club/list.controller';

jest.mock('../../../src/errors/error-response');
jest.mock('../../../src/business-logic/club');

describe('Controller: Club: list clubs ', () => {
  let req, res;

  beforeEach(() => {
    req = {};
    res = {
      send: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return a list of clubs when successful', async () => {
    const mockClubs = ['Club1', 'Club2', 'Club3'];
    ClubLogic.list.mockResolvedValue(mockClubs);
    await list(req, res);
    expect(res.send).toHaveBeenCalledWith({ clubs: mockClubs });
  });

  it('should return an error when club logic fails', async () => {
    const mockError = new Error('Club error');
    ClubLogic.list.mockRejectedValue(mockError);
    await list(req, res);
    expect(returnErrorResponse).toHaveBeenCalledWith({ error: mockError, res });
  });
});
