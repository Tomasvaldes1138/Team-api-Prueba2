import { expect, jest } from '@jest/globals';
import UserModel from '../../../src/models/user/user.model';
import getOne from '../../../src/business-logic/users/get-one';
import mongoose from 'mongoose';


jest.mock('../../../src/models/user/user.model');

describe('Business logic: User: Get one user', () => { 

    afterEach(async () => {
        jest.resetAllMocks();
    });

    it('Should get the user', async () => {
        const user = { name: 'usuario', email: 'correo3@gmail.com', password: '123', isAdmin: false };
        const query = new mongoose.Query();
        query.populate = jest.fn().mockReturnThis(); 
        query.select= jest.fn().mockReturnThis({ email: user.email });
        query.exec = jest.fn().mockResolvedValue(user);
        UserModel.findOne=jest.fn().mockReturnValue(query);   

        const resp = await getOne({ query: { email: user.email }, select: ['name', 'email'], populate: ['isAdmin']});
        expect(resp).not.toBeNull();
        expect 
        expect(resp.name).toEqual(user.name);
        expect(resp.email).toEqual(user.email);
        expect(resp.isAdmin).toEqual(user.isAdmin);
    })

    it('Should get null if the user doesnt exist', async () => {
        const user = { name: 'usuario', email: 'correo3@gmail.com', password: '123', isAdmin: false };
        UserModel.findOne.mockResolvedValue(null);

        const resp = await getOne({ query: { email: user.email }});
        expect(resp).toBeNull();
    })
})