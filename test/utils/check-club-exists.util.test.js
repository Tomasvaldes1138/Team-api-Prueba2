import ClubLogic from '../../src/business-logic/club';
import HTTPError from '../../src/errors/http.error';
import checkClubExists from '../../src/utils/check-club-exists.util';

jest.mock('../../src/business-logic/club');

describe('Utils: util: check club exists', () => {
  let mockErrorObject;

  beforeEach(() => {
    mockErrorObject = new HTTPError ({ name: 'error', message: 'some-error', code: 500 });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should not throw an error when the club exists', async () => {
    const mockClub = { id: 'club-id', name: 'Club Name' };
    ClubLogic.get.mockResolvedValue(mockClub);
    await expect(checkClubExists({ clubId: 'club-id', errorObject: mockErrorObject })).resolves.not.toThrow();
  });

  it('should throw an error when the club does not exist', async () => {
    try {
      ClubLogic.get.mockResolvedValue(null);
      await expect(checkClubExists({ clubId: 'club-id', errorObject: mockErrorObject })).rejects.toThrow();
    } catch (error) { 
      expect(error.name).toEqual('error');
      expect(error.message).toEqual('some-error');
      expect(error.code).toEqual(500);
    }
  });
});
