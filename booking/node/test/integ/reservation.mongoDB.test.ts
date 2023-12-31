import { after, afterEach, before, describe } from 'node:test';
import { createApp } from '../../src/app';
import { MONGODB_DATABASE, MONGODB_REPLICA_SET, MONGODB_URL } from '../../src/contants';
import {
  DEFAUTL_ARRIVAL_DATE,
  DEFAUTL_DEPARTURE_DATE,
  createMongoDBUser,
  deleteMongoDBUser,
  reservationTests,
} from '../utils';

describe('reservation tests with MongoDB', () => {
  const room = { id: 1, beds: 2 },
    user = { username: 'user', password: 'password' },
    reservation = {
      id: 1,
      roomId: room.id,
      checkInDate: DEFAUTL_ARRIVAL_DATE,
      checkOutDate: DEFAUTL_DEPARTURE_DATE,
      contactInformation: {
        email: 'name@example.com',
        phoneNumber: '+39 ...',
      },
      guestName: 'name',
      numberOfGuests: 2,
      specialRequests: '',
    },
    app = createApp(false)
      .withMongoDB(MONGODB_URL, MONGODB_DATABASE, MONGODB_REPLICA_SET)
      .withMongoDBAuth()
      .withRoomArray([room])
      .withReservationMongoDB()
      .app();

  before(async () => {
    await app.ready();
    await createMongoDBUser(app.mongo.db!, user);
  });

  afterEach(async () => {
    await app.reservationService.reset();
  });

  after(async () => {
    await deleteMongoDBUser(app.mongo.db!, user);
    await app.close();
  });

  reservationTests(app, reservation, user.username, user.password);
});
