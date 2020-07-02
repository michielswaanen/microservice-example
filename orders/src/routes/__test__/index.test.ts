import request from 'supertest';
import app from "../../app";
import { Ticket } from "../../models/tickets";

const buildTicket = async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 20
    });
    await ticket.save();
    return ticket;
}

it('returns 404 when not authorized', async () => {

});

it('fetches orders for an particular user', async () => {

    const ticketOne = await buildTicket();
    const ticketTwo = await buildTicket();
    const ticketThree = await buildTicket();

    const cookieForUser1 = global.getAuthCookie();
    const cookieForUser2 = global.getAuthCookie();

    await request(app)
        .post('/api/orders')
        .set('Cookie', cookieForUser1)
        .send({ticketId: ticketOne.id})
        .expect(201)

    const {body: orderTwo} = await request(app)
        .post('/api/orders')
        .set('Cookie', cookieForUser2)
        .send({ticketId: ticketTwo.id})
        .expect(201);

    const {body: orderThree} =await request(app)
        .post('/api/orders')
        .set('Cookie', cookieForUser2)
        .send({ticketId: ticketThree.id})
        .expect(201)

    const response = await request(app)
        .get('/api/orders/')
        .set('Cookie', cookieForUser2)
        .expect(200)

    expect(response.body.length).toEqual(2);
    expect(response.body[0].id).toEqual(orderTwo.id);
    expect(response.body[1].id).toEqual(orderThree.id);
    expect(response.body[0].ticket.id).toEqual(ticketTwo.id);
    expect(response.body[1].ticket.id).toEqual(ticketThree.id);

})