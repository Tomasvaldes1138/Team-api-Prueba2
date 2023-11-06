import { expect, jest } from '@jest/globals';
import getClub from '../../../src/business-logic/club/get';
import ClubModel from '../../../src/models/club/club.model';
import mongoose from 'mongoose';

jest.mock('../../../src/models/club/club.model');


describe('Business logic: Club: Get club Id', () => {

    const createObjectId = () => new mongoose.Types.ObjectId();

    afterEach(async () => {
        jest.resetAllMocks();
    });
    const club = {
        name: 'club-test',
        description: 'description',
      };

    it('Should get the club by id', async () => {
        const clubId = createObjectId();
        ClubModel.findById.mockResolvedValue({ ...club, clubId});
        const result = await getClub(clubId)
        expect(ClubModel.findById).toHaveBeenCalled();
        expect(result).not.toBeNull();
        expect(result.name).toEqual(club.name);
    })
    
    it('Should throw an error when the IdClub doesnt exists', async () => { 
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