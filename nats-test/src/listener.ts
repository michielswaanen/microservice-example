import nats, { Message } from 'node-nats-streaming';
import { randomBytes } from "crypto";

console.clear();

const client = nats.connect('ticketing', randomBytes(4).toString('hex'), {
    url: 'http://localhost:4222'
});

client.on('connect', () => {
    console.log('Listener connected to NATS');

    client.on('close', () => {
        console.log('NATS connection closed!');
        process.exit();
    });

    const options = client
        .subscriptionOptions()
        .setManualAckMode(true) // Acknowledgement of event reception on the service must be done manually,
                                // default behaviour does this automatically when the service receives the event.
                                // This is wrong because when the service crashes the event is lost.
                                // We only want to acknowledge the reception of the event when all the processing
                                // inside the service is done.
                                // When the acknowledgement didn't happen, NATS will resend the event
                                // after 30 seconds, this will keep happening until it's acknowledged.
        .setDeliverAllAvailable()   // Upon creation of a completely new listener / queue-group
                                    // this function will send all the (processed & unprocessed) events
                                    // that are stored on the NATS Streaming Server.
                                    // This way, a totally new service (listener) / queue-group which always
                                    // represent, a new table/micro-service will process the full history
                                    // of emitted events from its initial creation.
        .setDurableName('orders-service')   // Takes all the events from a durable subscription group aka. history log
                                            // Once the service (listener) is (back) online it will start processing
                                            // unprocessed events from inside the history log.
                                            // This function tells the service (listener) to process the
                                            // unprocessed events from a specific durable subscription group

    const subscription = client.subscribe(
        'ticket:created',
        'orders-service-queue-group',   // Run multiple services (listeners) that listen for the same subject
                                               // Load distributed between the services using round-robin or other algorithms.
        options);

    subscription.on('message', (msg: Message) => {
        const data = msg.getData();

        if (typeof data === 'string') {
            console.log(`Received event #${ msg.getSequence() }, with data: ${ data }`);
        }

        msg.ack(); // Acknowledge message
    })
});

process.on('SIGINT', () => client.close()); // Doesn't work on windows
process.on('SIGTERM', () => client.close()); // Doesn't work on windows