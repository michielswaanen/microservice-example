import request from 'supertest';
import app from '../../app';
import mongoose from 'mongoose';
import { natsWrapper } from "../../nats-wrapper";

it('returns a 404 if the provided id does not exist', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie', global.getAuthCookie())
        .send({
            title: 'test',
            price: 20
        })
        .expect(404);
});

it('returns a 401 if the user is not authorized', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
        .put(`/api/tickets/${id}`)
        .send({
            title: 'test',
            price: 20
        })
        .expect(401);
});

it('returns a 401 if the user does not own the ticket', async () => {
    const title = 'test';
    const price = 20;

    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', global.getAuthCookie())
        .send({
            title, price
        });

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', global.getAuthCookie())
        .send({
            title: title + "bla",
            price: price + 80
        })
        .expect(401);

    expect(response.body.title).toEqual(title);
    expect(response.body.price).toEqual(price);
});

it('returns a 400 if the user provides an invalid title or price', async () => {
    const cookie = global.getAuthCookie();
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'Test',
            price: 20
        });

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: '',
            price: 20
        })
        .expect(400);

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'Test',
            price: -10
        })
        .expect(400);

});

it('returns the ticket provided valid inputs', async () => {
    const cookie = global.getAuthCookie();

    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'Test',
            price: 20
        });

    const updatedResponse = await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'Test2',
            price: 300
        })
        .expect(200);

    expect(updatedResponse.body.title).toEqual('Test2');
    expect(updatedResponse.body.price).toEqual(300);
});

it('publishes an event', async () => {
    const cookie = global.getAuthCookie();

    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'Test',
            price: 20
        });

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'Test2',
            price: 300
        })
        .expect(200);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});

