import request from 'supertest';
import app from '../../app';

it('returns a 201 on successful sign up', async () => {
    return request(app)
        .post('/api/users/sign-up')
        .send({
            email: 'michiel.swaanen@test.com',
            password: '1234'
        })
        .expect(201);
});

it('returns a 400 with an invalid email', async () => {
    return request(app)
        .post('/api/users/sign-up')
        .send({
            email: 'michiel.banaan_test.com',
            password: '1234'
        })
        .expect(400);
});

it('returns a 400 with an invalid password', async () => {
    return request(app)
        .post('/api/users/sign-up')
        .send({
            email: 'michiel.banaan@test.com',
            password: '12'
        })
        .expect(400);
});

it('returns a 400 with missing email and password', async () => {
    await request(app)
        .post('/api/users/sign-up')
        .send({email: 'michiel.swaanen@test.com'})
        .expect(400);

    return request(app)
        .post('/api/users/sign-up')
        .send({password: '12345'})
        .expect(400);
});

it('disallows duplicate emails', async () => {
    await request(app)
        .post('/api/users/sign-up')
        .send({
            email: 'michiel.swaanen@test.com',
            password: '1234'
        })
        .expect(201);

    return request(app)
        .post('/api/users/sign-up')
        .send({
            email: 'michiel.swaanen@test.com',
            password: '1234'
        })
        .expect(400);
});

it('sets a cookie after successful sign up', async () => {
    const response = await request(app)
        .post('/api/users/sign-up')
        .send({
            email: 'michiel.swaanen@test.com',
            password: '1234'
        })
        .expect(201);

    expect(response.get('Set-Cookie')).toBeDefined();
})