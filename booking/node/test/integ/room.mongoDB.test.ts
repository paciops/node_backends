import { after, afterEach, before, describe } from 'node:test';
import { createApp } from '../../src/app';
import { MONGODB_DATABASE, MONGODB_REPLICA_SET, MONGODB_URL } from '../../src/contants';
import { createMongoDBUser, deleteMongoDBUser, roomTests } from '../utils';

describe('room tests with MongoDB', () => {
  const user = { username: 'user', password: 'password' },
    app = createApp(false)
      .withMongoDB(MONGODB_URL, MONGODB_DATABASE, MONGODB_REPLICA_SET)
      .withMongoDBAuth()
      .withRoomMongoDB()
      .app();

  before(async () => {
    await app.ready();
    await createMongoDBUser(app.mongo.db!, user);
  });

  afterEach(async () => {
    await app.roomService.reset();
  });

  after(async () => {
    await deleteMongoDBUser(app.mongo.db!, user);
    await app.close();
  });

  roomTests(app, user.username, user.password);
});
