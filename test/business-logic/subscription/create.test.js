import { expect, jest } from '@jest/globals';
import createSub from '../../../src/business-logic/subscription/create';
import SubscriptionModel from '../../../src/models/subscription/subscription.model';
import checkIfTheUserIsTheClubAdmin from '../../../src/business-logic/club/check-is-admin';
import checkClubExists from '../../../src/utils/check-club-exists.util';
import mongoose from 'mongoose';
import HTTPError from '../../../src/errors/http.error';
import subscriptionErrors from '../../../src/errors/subscription.errors';
import clubErrors from '../../../src/errors/club.errors';

jest.mock('../../../src/business-logic/club/check-is-admin');
jest.mock('../../../src/utils/check-club-exists.util')
jest.mock('../../../src/models/subscription/subscription.model');

describe('Business logic: Subscription: Create', () => { 
    const subscription = {
        name: 'subcription-test',
        price:'price',
        description: 'description',
      };

    afterEach(async () => {
        jest.resetAllMocks();
    });
    const createObjectId = () => new mongoose.Types.ObjectId();

    
    it('Should create a subscription on database', async () => { 
        const clubId = createObjectId();
        checkClubExists.mockReturnValue({});
        checkIfTheUserIsTheClubAdmin.mockReturnValue({});
        SubscriptionModel.create.mockReturnValue({...subscription, clubId});
        const results= await createSub({...subscription, clubId})

        expect(results).not.toBeNull();
        expect(checkClubExists).toHaveBeenCalled();
        expect(checkIfTheUserIsTheClubAdmin).toHaveBeenCalled();
        expect(SubscriptionModel.create).toHaveBeenCalled();
        expect(results.name).toEqual(subscription.name);
        expect(results.price).toEqual(subscription.price);
        expect(results.description).toEqual(subscription.description);
        expect(results.clubId).toEqual(clubId);
        
    })

    it('Should throws an error when the club doesnt exists', async () => { 
        const clubId = createObjectId();
        checkClubExists.mockRejectedValue(new HTTPError({ ...subscriptionErrors.clubNotFound, code: 404 }));

        try {
            await createSub({...subscription, clubId})
        }catch(error){
            expect(checkClubExists).toHaveBeenCalled();
            expect(error).not.toBeNull();
            expect(error.name).toEqual(subscriptionErrors.clubNotFound.name);
            expect(error.message).toEqual(subscriptionErrors.clubNotFound.message);
            expect(error.statusCode).toEqual(404);
        }
    })

    it('Should throws an error when the user is not the admin', async () => { 
        const clubId = createObjectId();
        checkClubExists.mockReturnValue({});
        checkIfTheUserIsTheClubAdmin.mockRejectedValue(new HTTPError({ ...clubErrors.userIsNotTheAdmin, code: 403 }));
        try {
            await createSub({ ...subscription, clubId })
        } catch (error) {
            expect(checkClubExists).toHaveBeenCalled();
            expect(error).not.toBeNull();
            expect(error.name).toEqual(clubErrors.userIsNotTheAdmin.name);
            expect(error.message).toEqual(clubErrors.userIsNotTheAdmin.message);
            expect(error.statusCode).toEqual(403);
        }
    })
})