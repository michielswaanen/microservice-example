import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import app from '../app';
import request from "supertest";

declare global {
    namespace NodeJS {
        interface Global {
            getAuthCookie(): Promise<string[]>
        }
    }
}


let mongo: any;

beforeAll(async () => {
    process.env.JWT_KEY = 'asdfasddg'

    mongo = new MongoMemoryServer();
    const mongoUri = await mongo.getUri();

    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
});

beforeEach(async () => {
   const collections = await mongoose.connection.db.collections();
   for(let collection of collections) {
       await collection.deleteMany({});
   }
});

afterAll(async () => {
    await mongo.stop();
    await mongoose.connection.close();
});

global.getAuthCookie = async () => {
    const email = 'test@test.com';
    const password = '1234';

    const response = await request(app)
        .post('/api/users/sign-up')
        .send({
            email, password
        })
        .expect(201);

    return response.get('Set-Cookie');
}