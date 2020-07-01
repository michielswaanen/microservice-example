import nats from 'node-nats-streaming';
import { TicketCreatedPublisher } from "./events/ticket-created-publisher";

console.clear();
console.log('>> NATS Streaming Client >> Connecting...');

const client = nats.connect('ticketing', 'adc', {
    url: 'http://localhost:4222'
});

client.on('connect', async() => {
    console.log('>> NATS Streaming Client >> Successfully Connected');

    const publisher = new TicketCreatedPublisher(client);
    try {
        await publisher.publish({
            id: '123',
            title: 'Concert',
            price: 20
        });
    } catch(err) {
        console.error(err);
    }
});