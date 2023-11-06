import { expect, jest } from '@jest/globals';
import create from '../../../src/business-logic/member/create';
import MemberModel from '../../../src/models/member/member.model';
import checkIfUserIsAdmin from '../../../src/business-logic/club/check-is-admin';
import memberErrors from '../../../src/errors/member.errors';
import HTTPError from '../../../src/errors/http.error';
import checkClubExists from '../../../src/utils/check-club-exists.util';

jest.mock('../../../src/business-logic/club/check-is-admin');
jest.mock('../../../src/models/member/member.model');
jest.mock('../../../src/utils/check-club-exists.util');

describe('Business logic: Member: Create', () => {
  afterEach(async () => {
    jest.resetAllMocks();
  });

  it('Should throws an error when the club doesnt exists', async () => {
    checkClubExists.mockRejectedValue(
      new HTTPError({ ...memberErrors.clubNotFound, code: 404 }),
    );
    try {
      await create({ clubId: 'asd1' });
    } catch (error) {
      expect(error.message).toEqual(memberErrors.clubNotFound.message);
      expect(error.name).toEqual(memberErrors.clubNotFound.name);
      expect(error.statusCode).toEqual(404);
      expect(error).toEqual(new HTTPError({ ...memberErrors.clubNotFound, code: 404 }));
    }
  });

  it('Should throws an error when the user is not the admin', async () => {
    checkClubExists.mockReturnValue({});
    checkIfUserIsAdmin.mockRejectedValue(new Error('user-is-not-the-admin-error'));
    try {
      await create({ clubId: 'asd1', userId: 'user-id' });
      throw new Error('other-error');
    } catch (error) {
      expect(error.message).toEqual('user-is-not-the-admin-error');
      expect(checkClubExists).toBeCalled();
      expect(checkIfUserIsAdmin).toBeCalledWith({ clubId: 'asd1', userId: 'user-id' });
    }
  });

  it('Should create a member when the user is the admin', async () => {
    checkClubExists.mockReturnValue({});
    checkIfUserIsAdmin.mockReturnValue({});
    MemberModel.create.mockReturnValue({ name: 'miembro1' });

    const clubMock = { clubId: 'asd1', userId: 'user-id' };

    const result = await create(clubMock);

    expect(result).not.toBeNull();
    expect(result.name).toEqual('miembro1');
    expect(checkClubExists).toBeCalled();
    expect(checkIfUserIsAdmin).toBeCalledWith(clubMock);
    expect(MemberModel.create).toBeCalledWith(clubMock);
  });
});
