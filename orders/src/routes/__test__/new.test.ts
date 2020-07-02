import request from 'supertest';
import mongoose from 'mongoose';
import app from "../../app";
import { Order } from "../../models/order";
import { Ticket } from "../../models/tickets";
import { OrderStatus } from "@tickets-ms/common";
import { natsWrapper } from "../../nats-wrapper";

it('returns an error if the ticket does mot exist', async () => {
    const ticketId = mongoose.Types.ObjectId();

    await request(app)
        .post('/api/orders')
        .set('Cookie', global.getAuthCookie())
        .send({
            ticketId: ticketId
        })
        .expect(404);
})

it('returns an error if the ticket is already reserved', async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 20
    });
    await ticket.save();

    const order = Order.build({
        ticket: ticket,
        userId: 'randomID',
        status: OrderStatus.Created,
        expiresAt: new Date()
    });
    await order.save();

    await request(app)
        .post('/api/orders')
        .set('Cookie', global.getAuthCookie())
        .send({ticketId: ticket.id})
        .expect(400);
})

it('reserves a ticket', async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 20
    });
    await ticket.save();

    await request(app)
        .post('/api/orders')
        .set('Cookie', global.getAuthCookie())
        .send({ticketId: ticket.id})
        .expect(201);
})

it('emits an order created event', async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 20
    });
    await ticket.save();

    await request(app)
        .post('/api/orders')
        .set('Cookie', global.getAuthCookie())
        .send({ticketId: ticket.id})
        .expect(201);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});

