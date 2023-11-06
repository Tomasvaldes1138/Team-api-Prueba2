import { expect, jest } from '@jest/globals';
import listClubs from '../../../src/business-logic/club/list';
import ClubModel from '../../../src/models/club/club.model';
import mongoose from 'mongoose';

jest.mock('../../../src/models/club/club.model');

describe('Business logic: Club: List clubs', () => {

    afterEach(async () => {
        jest.resetAllMocks();
    });

    it('Should return a list of clubs', async () => {
        const clubs = [{ name: 'club1', admin: 'admin1' }, { name: 'club2', admin: 'admin2' }]
        const query = new mongoose.Query();
        query.populate = jest.fn().mockReturnThis();
        query.exec = jest.fn().mockResolvedValue(clubs);
        ClubModel.find = jest.fn().mockReturnValue(query);        
        const resp=await listClubs();
        expect(resp).toEqual(clubs);
        expect(ClubModel.find).toHaveBeenCalled();
    })

    it('Should return a empty list', async () => { 
        const clubs = []
        const query = new mongoose.Query();
        query.populate = jest.fn().mockReturnThis();
        query.exec = jest.fn().mockResolvedValue(clubs);
        ClubModel.find = jest.fn().mockReturnValue(query);        
        const resp=await listClubs();
        expect(resp).toEqual(clubs);
        expect(ClubModel.find).toHaveBeenCalled();
    })
    
})