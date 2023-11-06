import { expect, jest } from '@jest/globals';
import checkIfTheUserIsTheClubAdmin from '../../../src/business-logic/club/check-is-admin';
import ClubModel from '../../../src/models/club/club.model';
import HTTPError from '../../../src/errors/http.error';
import mongoose from 'mongoose';

jest.mock('../../../src/business-logic/club');
jest.mock('../../../src/models/club/club.model');

describe('Business logic: Club: Check is admin', () => {
 
    const createObjectId = () => new mongoose.Types.ObjectId();

    afterEach(async () => {
        jest.resetAllMocks();
    });
    

    it('Should verificate if the user is the admin of the club', async () => {
        const adminId = createObjectId();
        const clubId = createObjectId();

        ClubModel.findOne.mockResolvedValue({ _id: clubId, admin: adminId });
        
        await expect(checkIfTheUserIsTheClubAdmin({ clubId, userId: adminId })).resolves.not.toThrow();
        expect(ClubModel.findOne).toHaveBeenCalled();
    
    })

    it('Should throw an error when if the user is not the admin of the club', async () => {
        const adminId = createObjectId();
        const clubId = createObjectId();

        ClubModel.findOne.mockResolvedValue(null);
        try {
            await checkIfTheUserIsTheClubAdmin({ clubId, userId: adminId })
        } catch (error) {
            await expect(checkIfTheUserIsTheClubAdmin({ clubId, adminId })).rejects.toThrow(HTTPError);
            expect(error.message).toEqual('this users is not the admin of this club');
            expect(ClubModel.findOne).toHaveBeenCalled();
        }

    })
})