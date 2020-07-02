import mongoose from 'mongoose';
import app from './app';
import { natsWrapper } from "./nats-wrapper";

const start = async () => {
    if(!process.env.JWT_KEY) {
        throw new Error('JWT_KEY must be defined');
    }

    if(!process.env.MONGO_URI) {
        throw new Error('MONGO_URI must be defined');
    }

    if(!process.env.NATS_CLUSTER_ID) {
        throw new Error('NATS_CLUSTER_ID must be defined');
    }

    if(!process.env.NATS_URL) {
        throw new Error('NATS_URL must be defined');
    }

    if(!process.env.NATS_CLIENT_ID) {
        throw new Error('NATS_CLIENT_ID must be defined');
    }

    if(!process.env.EXPIRATION_WINDOW_SECONDS) {
        throw new Error('EXPIRATION_WINDOW_SECONDS must be defined');
    }

    try {
        // ClusterID that is defined in the nats-depl.yaml file
        await natsWrapper.connect(process.env.NATS_CLUSTER_ID, process.env.NATS_CLIENT_ID, process.env.NATS_URL);

        natsWrapper.client.on('close', () => {
            console.log('NATS Streaming Server - Client Shutdown Successfully')
            process.exit();
        })

        // When NATS get INTERRUPTED or TERMINATED we close the connection
        process.on('SIGINT', () => natsWrapper.client.close()); // Doesn't work on windows
        process.on('SIGTERM', () => natsWrapper.client.close()); // Doesn't work on windows

        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        console.log('Connected to Mongodb');

        app.listen(3000, () => {
            console.log('Listening on port 3000!');
        });
    } catch (err) {
        console.log(err);
    }
}

start();