import request from 'supertest';
import app from "../../app";
import { Ticket } from "../../models/tickets";
import mongoose from "mongoose";

it('fetches the order', async () => {
    const ticket = Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 200
    })

    await ticket.save();

    const cookie = global.getAuthCookie();

    const {body: order} = await request(app)
        .post('/api/orders')
        .set('Cookie', cookie)
        .send({ticketId: ticket.id})
        .expect(201);

    const {body: fetchOrder} = await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', cookie)
        .send()
        .expect(200);

    expect(fetchOrder.id).toEqual(order.id);
});

it('returns an error if one user tries to fetch another users order', async () => {
    const ticket = Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 200
    })

    await ticket.save();

    const userOne = global.getAuthCookie();
    const userTwo = global.getAuthCookie();

    const {body: order} = await request(app)
        .post('/api/orders')
        .set('Cookie', userOne)
        .send({ticketId: ticket.id})
        .expect(201);

    await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', userTwo)
        .send()
        .expect(401);
});