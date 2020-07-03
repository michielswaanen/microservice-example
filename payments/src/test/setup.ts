import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken'

declare global {
    namespace NodeJS {
        interface Global {
            getAuthCookie(id?: string): string[];
        }
    }
}


let mongo: any;

jest.mock('../nats-wrapper');

process.env.STRIPE_KEY = 'sk_test_51H0WWgLyVdyIeDfZMVR4GA8nE7tZ0ebjDK0iyAUfYDPsPX5Wy6walvIlcIjCSiSnCfftlYrJ4trHMy7za7NroTEp00JqiP55kg'

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

global.getAuthCookie = (id?: string) => {

    // Build JWT payload
    const payload = {
        id: id || new mongoose.Types.ObjectId().toHexString(),
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