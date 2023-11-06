import { expect, jest } from '@jest/globals';
import mongoose from 'mongoose';
import checkIfTheUserIsTheClubAdmin from '../../../src/business-logic/club/check-is-admin';
import listByClub from '../../../src/business-logic/subscription/list-by-club';
import SubscriptionModel from '../../../src/models/subscription/subscription.model';
import subscriptionFactory from '../../factories/subscription.factory';

jest.mock('../../../src/models/subscription/subscription.model');
jest.mock('../../../src/business-logic/club/check-is-admin');

describe('Business logic: Member: List members by club', () => { 
    const createObjectId = () => new mongoose.Types.ObjectId();

    afterEach(async () => {
        jest.resetAllMocks();
    });

    it('Should return a list of subscriptions by club', async () => { 
        const adminId = createObjectId();
        const clubId = createObjectId();
        checkIfTheUserIsTheClubAdmin.mockReturnValue({});
        const members = subscriptionFactory.buildList(3, { clubId: clubId });
        SubscriptionModel.find.mockResolvedValue(members);

        const result = await listByClub({ clubId: clubId, userId: adminId });
        expect(SubscriptionModel.find).toHaveBeenCalled();
        expect(result).toEqual(members);
        expect(result).toHaveLength(3);
    })

    it('Should return a empty list', async () => {
        const adminId = createObjectId();
        const clubId = createObjectId();
        checkIfTheUserIsTheClubAdmin.mockReturnValue({});
        const members = [];
        SubscriptionModel.find.mockReturnValue(members);
        const result = await listByClub({ clubId: clubId, userId: adminId });
        expect(SubscriptionModel.find).toHaveBeenCalled();
        expect(result).toEqual(members);
        expect(result).toHaveLength(0);

     })
})