import { expect, jest } from '@jest/globals';
import mongoose from 'mongoose';
import listByClub from '../../../src/business-logic/member/list-by-club';
import memberFactory from '../../factories/member.factory';
import MemberModel from '../../../src/models/member/member.model';
import checkIfTheUserIsTheClubAdmin from '../../../src/business-logic/club/check-is-admin';

jest.mock('../../../src/models/member/member.model');
jest.mock('../../../src/business-logic/club/check-is-admin');

describe('Business logic: Member: List members by club', () => { 
    const createObjectId = () => new mongoose.Types.ObjectId();

    afterEach(async () => {
        jest.resetAllMocks();
    });

    it('Should return a list of members', async () => { 
        const adminId = createObjectId();
        const clubId = createObjectId();
        checkIfTheUserIsTheClubAdmin.mockReturnValue({});
        const members = memberFactory.buildList(3, { clubId: clubId });
        MemberModel.find.mockResolvedValue(members);

        const result = await listByClub({ clubId: clubId, userId: adminId });
        expect(MemberModel.find).toHaveBeenCalled();
        expect(result).toEqual(members);
        expect(result).toHaveLength(3);
    })

    it('Should return a empty list', async () => {
        const adminId = createObjectId();
        const clubId = createObjectId();
        checkIfTheUserIsTheClubAdmin.mockReturnValue({});
        const members = [];
        MemberModel.find.mockReturnValue(members);
        const result = await listByClub({ clubId: clubId, userId: adminId });
        expect(MemberModel.find).toHaveBeenCalled();
        expect(result).toEqual(members);
        expect(result).toHaveLength(0);

     })
})