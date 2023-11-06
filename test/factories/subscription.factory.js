import { Factory } from 'rosie';
import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';

const subscriptionFactory = new Factory()
    .sequence('name', (i) => `name ${i}`)
    .sequence('price', (i) => faker.string.numeric(8))
    .sequence('description', () => faker.lorem.sentence(20))
    .sequence('clubId', () => mongoose.Types.ObjectId())

export default subscriptionFactory;