import { FastifyInstance } from 'fastify';
import { Db } from 'mongodb';
import assert from 'node:assert';
import { it } from 'node:test';
import request from 'supertest';
import { URLS } from '../src/contants';
import { Reservation } from '../src/domain';

export const DEFAUTL_ARRIVAL_DATE = new Date(Date.UTC(2023, 0, 1));
export const DEFAUTL_DEPARTURE_DATE = new Date(Date.UTC(2023, 0, 2));

export const createMongoDBUser = async (
  db: Db,
  user: { username: string; password: string },
  collectionName = 'users'
) => {
  const result = await db.collection(collectionName).insertOne(user);
  if (result) return result.insertedId;
  throw new Error('result is undefined');
};

export const deleteMongoDBUser = async (db: Db, user: { username: string; password: string }) => {
  db.collection('users').deleteOne(user);
};

export const roomTests = (app: FastifyInstance, user: string, password: string) => {
  it('should not find any room', async () => {
    const response = await request(app.server).get(`/${URLS.ROOMS}/123`).auth(user, password, { type: 'basic' });
    assert.deepStrictEqual(response.statusCode, 404);
    assert.deepStrictEqual(response.text, 'not found');
  });

  it('should add a room', async () => {
    const id = 1,
      beds = 2,
      response = await request(app.server)
        .post(`/${URLS.ROOMS}`)
        .auth(user, password, { type: 'basic' })
        .send({ id, beds });

    assert.deepStrictEqual(response.statusCode, 201);
    assert.deepStrictEqual(response.body.success, true);
  });

  it('should not add a room that already exists', async () => {
    const id = 1,
      beds = 2;
    await request(app.server).post(`/${URLS.ROOMS}`).auth(user, password, { type: 'basic' }).send({ id, beds });
    const response = await request(app.server)
      .post(`/${URLS.ROOMS}`)
      .auth(user, password, { type: 'basic' })
      .send({ id, beds });
    assert.deepStrictEqual(response.statusCode, 400);
    assert.deepStrictEqual(response.body.success, false);
  });

  it('should find a room', async () => {
    const id = 1,
      beds = 2;
    await request(app.server).post(`/${URLS.ROOMS}`).auth(user, password, { type: 'basic' }).send({ id, beds });
    const response = await request(app.server).get(`/${URLS.ROOMS}/${id}`).auth(user, password, { type: 'basic' });
    assert.deepStrictEqual(response.statusCode, 200);
    assert.deepStrictEqual(response.body.id, id);
    assert.deepStrictEqual(response.body.beds, beds);
  });
};

export const reservationTests = (app: FastifyInstance, reservation: Reservation, user: string, password: string) => {
  it('should not find any reservation', async () => {
    const response = await request(app.server).get(`/${URLS.RESERVATIONS}/123`).auth(user, password, { type: 'basic' });
    assert.deepStrictEqual(response.statusCode, 404);
    assert.deepStrictEqual(response.text, 'not found');
  });

  it('should add a reservation', async () => {
    const response = await request(app.server)
      .post(`/${URLS.RESERVATIONS}`)
      .auth(user, password, { type: 'basic' })
      .send(reservation);

    assert.deepStrictEqual(response.statusCode, 201, response.text);
    assert.deepStrictEqual(response.body.success, true, response.text);
  });

  it('should not add a reservation with the same id', async () => {
    await request(app.server).post(`/${URLS.RESERVATIONS}`).auth(user, password, { type: 'basic' }).send(reservation);
    const response = await request(app.server)
      .post(`/${URLS.RESERVATIONS}`)
      .auth(user, password, { type: 'basic' })
      .send(reservation);

    assert.deepStrictEqual(response.statusCode, 400);
    assert.deepStrictEqual(response.body.success, false);
    assert.deepStrictEqual(response.body.reason, 'already exists');
  });

  it('should not add a reservation with an overlapping period', async () => {
    const checkOutDate = new Date(reservation.checkOutDate);
    checkOutDate.setDate(checkOutDate.getDate() + 1);

    await request(app.server).post(`/${URLS.RESERVATIONS}`).auth(user, password, { type: 'basic' }).send(reservation);

    const overlappingReservation = {
        ...reservation,
        id: reservation.id + 1,
        checkInDate: reservation.checkInDate,
        checkOutDate,
      },
      response = await request(app.server)
        .post(`/${URLS.RESERVATIONS}`)
        .auth(user, password, { type: 'basic' })
        .send(overlappingReservation);

    assert.deepStrictEqual(response.statusCode, 400);
    assert.deepStrictEqual(response.body.success, false);
    assert.deepStrictEqual(response.body.reason, 'room already booked in this period');
  });
};
