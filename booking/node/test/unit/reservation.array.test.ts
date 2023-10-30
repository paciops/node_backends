import { after, afterEach, before, describe } from 'node:test';
import { createApp } from '../../src/app';
import { DEFAUTL_ARRIVAL_DATE, DEFAUTL_DEPARTURE_DATE, reservationTests } from '../utils';

describe('reservation tests with in memory array', () => {
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
    app = createApp(false).withArrayAuth([user]).withRoomArray([room]).withReservationArray().app();

  before(async () => {
    await app.ready();
  });

  afterEach(() => {
    app.reservationService.reset();
  });

  after(() => {
    app.roomService.reset();
    app.close();
  });

  reservationTests(app, reservation, user.username, user.password);
});
