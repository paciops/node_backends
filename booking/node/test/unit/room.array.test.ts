import { after, afterEach, before, describe } from 'node:test';
import { createApp } from '../../src/app';
import { roomTests } from '../utils';

describe('room tests with in memory array', () => {
  const user = { username: 'user', password: 'password' },
    app = createApp(false).withArrayAuth([user]).withRoomArray().app();

  before(async () => {
    await app.ready();
  });

  afterEach(() => {
    app.roomService.reset();
  });

  after(() => {
    app.close();
  });

  roomTests(app, user.username, user.password);
});
