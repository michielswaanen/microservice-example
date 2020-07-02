import { TicketCreatedListener } from "../ticket-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketCreatedEvent } from "@tickets-ms/common";
import mongoose from 'mongoose';
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/tickets";

const setup = async () => {
    // Create an instance of the listener
    const listener = new TicketCreatedListener(natsWrapper.client);

    // Create fake event data (ex: TicketCreateEvent['data'])
    const data: TicketCreatedEvent['data'] = {
        version: 0,
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'convert',
        price: 20,
        userId: new mongoose.Types.ObjectId().toHexString()
    };

    // Create fake message (ex: Message from node-nats-streaming)
    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return { listener, data, msg };
}

it('creates and saves a ticket', async () => {
    const {listener, data, msg} = await setup();

    // Call the onMessage function with the fake event data & message
    // (REMEMBER: onMessage saves the received data to the database)
    await listener.onMessage(data, msg);

    // Write assertions to check if ticket was created
    const ticket = await Ticket.findById(data.id);

    expect(ticket).toBeDefined();
    expect(ticket!.title).toEqual(data.title);
    expect(ticket!.price).toEqual(data.price);
});

it('acks the message', async () => {
    const {listener, data, msg} = await setup();

    // Call the onMessage function with the fake event data & message
    await listener.onMessage(data, msg);

    // Write assertions to check if ack function is called
    expect(msg.ack).toHaveBeenCalled();
})