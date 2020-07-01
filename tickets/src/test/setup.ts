import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken'

declare global {
    namespace NodeJS {
        interface Global {
            getAuthCookie(): string[];
        }
    }
}


let mongo: any;

jest.mock('../nats-wrapper');

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
    jest.clearAllMocks();
   const collections = await mongoose.connection.db.collections();
   for(let collection of collections) {
       await collection.deleteMany({});
   }
});

afterAll(async () => {
    await mongo.stop();
    await mongoose.connection.close();
});

global.getAuthCookie = () => {

    // Build JWT payload
    const payload = {
        id: mongoose.Types.ObjectId().toHexString(),
        email: 'test@test.com'
    };

    // Create the JWT
    const token = jwt.sign(payload, process.env.JWT_KEY!);

    // Build session Object
    const session = {jwt: token};

    // Turn that session into JSON
    const sessionJSON = JSON.stringify(session);

    // Take that JSON and encode it as base64
    const base64 = Buffer.from(sessionJSON).toString('base64');

    return [`express:sess=${base64}`];
}