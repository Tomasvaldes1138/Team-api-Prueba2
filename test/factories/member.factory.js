import { Factory } from 'rosie';
import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';

const memberFactory = new Factory()
    .sequence('name', (i) => `name ${i}`)
    .sequence('lastName', (i) => `name ${i}`)
    .sequence('email', () => faker.internet.email())
    .sequence('dni', () => faker.string.alphanumeric(8))
    .sequence('clubId', () => mongoose.Types.ObjectId())

export default memberFactory;