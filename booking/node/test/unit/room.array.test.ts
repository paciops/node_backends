import { after, afterEach, before, describe } from 'node:test';
import { createApp } from '../../src/app';
import { roomsArray } from '../../src/databases/inmemory';
import { roomTests } from '../utils';

describe('room tests with in memory array', () => {
  const roomDb = roomsArray(),
    user = { username: 'user', password: 'password' },
    app = createApp(false).withArrayAuth([user]).withRoomArray(roomDb).app();

  before(async () => {
    await app.ready();
  });

  afterEach(() => {
    roomDb.reset();
  });

  after(() => {
    app.close();
  });

  roomTests(app, user.username, user.password);
});
