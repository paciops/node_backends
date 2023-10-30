import { after, afterEach, before, describe } from 'node:test';
import { createApp } from '../../src/app';
import { MONGODB_DATABASE, MONGODB_REPLICA_SET, MONGODB_URL } from '../../src/contants';
import { roomsMongoDB } from '../../src/databases/mongodb';
import { roomsRoutes } from '../../src/routes';
import { createMongoDBUser, deleteMongoDBUser, roomTests } from '../utils';

describe('room tests with MongoDB', () => {
  const app = createApp(false).withMongoDB(MONGODB_URL, MONGODB_DATABASE, MONGODB_REPLICA_SET).withMongoDBAuth().app(),
    user = { username: 'user', password: 'password' },
    roomDb = roomsMongoDB(app);
  app.register((app) => roomsRoutes(app, roomDb));

  before(async () => {
    await app.ready();
    await createMongoDBUser(app.mongo.db!, user);
  });

  afterEach(async () => {
    await roomDb.reset();
  });

  after(async () => {
    await deleteMongoDBUser(app.mongo.db!, user);
    await app.close();
  });

  roomTests(app, user.username, user.password);
});
