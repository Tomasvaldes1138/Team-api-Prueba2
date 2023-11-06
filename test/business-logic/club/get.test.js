import { expect, jest } from '@jest/globals';
import getClub from '../../../src/business-logic/club/get';
import ClubModel from '../../../src/models/club/club.model';
import mongoose from 'mongoose';
import e from 'cors';

jest.mock('../../../src/models/club/club.model');


describe('Business logic: Club: Get club Id', () => {

    const createObjectId = () => new mongoose.Types.ObjectId();

    afterEach(async () => {
        jest.resetAllMocks();
        await ClubModel.deleteMany({});
    });

    it('Should get the club by id', async () => {
        const clubId = createObjectId();

        ClubModel.findById.mockResolvedValue({ _id: clubId });

        const result=await expect(getClub(clubId)).resolves.not.toThrow();
        expect(ClubModel.findById).toHaveBeenCalled();
        expect(result).not.toBeNull();
        
    })
    it('Should throw an error when the club doesnt exists', async () => { 
        const clubId = createObjectId();
        ClubModel.findById.mockResolvedValue(null);
        try {
            await getClub(clubId)
        } catch (error) {
            await expect(getClub(clubId)).rejects.toThrow(HTTPError);
            expect(ClubModel.findById).toHaveBeenCalled();
        }
    })
})