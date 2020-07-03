import { natsWrapper } from "./nats-wrapper";
import { OrderCreatedListener } from "./events/listeners/order-created-listener";

const start = async () => {
    console.log('Expiration Service >> Starting up...');

    if(!process.env.NATS_CLUSTER_ID) {
        throw new Error('NATS_CLUSTER_ID must be defined');
    }

    if(!process.env.NATS_URL) {
        throw new Error('NATS_URL must be defined');
    }

    if(!process.env.NATS_CLIENT_ID) {
        throw new Error('NATS_CLIENT_ID must be defined');
    }

    if(!process.env.REDIS_HOST) {
        throw new Error('REDIS_HOST must be defined');
    }

    try {
        // ClusterID that is defined in the nats-depl.yaml file
        await natsWrapper.connect(process.env.NATS_CLUSTER_ID, process.env.NATS_CLIENT_ID, process.env.NATS_URL);

        natsWrapper.client.on('close', () => {
            console.log('NATS Streaming Server - Client Shutdown Successfully')
            process.exit();
        })

        new OrderCreatedListener(natsWrapper.client).listen();

        // When NATS get INTERRUPTED or TERMINATED we close the connection
        process.on('SIGINT', () => natsWrapper.client.close()); // Doesn't work on windows
        process.on('SIGTERM', () => natsWrapper.client.close()); // Doesn't work on windows

    } catch (err) {
        console.log(err);
    }
}

start();