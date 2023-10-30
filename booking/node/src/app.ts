import { fastifyBasicAuth } from '@fastify/basic-auth';
import { fastifyMongodb } from '@fastify/mongodb';
import { fastify } from 'fastify';
import { authorizationArray, authorizationMongoDB } from './auth';
import { reservationMongoDB, roomsMongoDB } from './databases/mongodb';
import { ReservationLogic, RoomLogic, User } from './domain';
import { reservationsRoutes, roomsRoutes } from './routes';

export const createApp = (logger: boolean) => {
  const app = fastify({ logger });
  let roomsDB: RoomLogic | undefined;
  const appCreator = {
    withMongoDB(url: string, database: string, replicaSet: string | undefined, directConnection = true) {
      app.register(fastifyMongodb, {
        url,
        database,
        replicaSet,
        directConnection,
      });
      return appCreator;
    },
    withMongoDBAuth() {
      app.register(fastifyBasicAuth, { validate: authorizationMongoDB(app) });
      return appCreator;
    },
    withArrayAuth(users: User[] = []) {
      app.register(fastifyBasicAuth, { validate: authorizationArray(users) });
      return appCreator;
    },
    withRoomLogic(roomLogic: RoomLogic) {
      app.register((app) => roomsRoutes(app, roomLogic));
      return appCreator;
    },
    withRoomMongoDB() {
      roomsDB = roomsMongoDB(app);
      app.register((app) => roomsRoutes(app, roomsDB!));
      return appCreator;
    },
    withRoomArray(roomLogic: RoomLogic) {
      app.register((app) => roomsRoutes(app, roomLogic));
      return appCreator;
    },
    withReservationMongoDB(roomsLogic?: RoomLogic) {
      const localRoomDb = roomsLogic || roomsDB;
      if (!localRoomDb) throw new Error('rooms logic is undefined');
      app.register((app) => reservationsRoutes(app, reservationMongoDB(app, localRoomDb)));
      return appCreator;
    },
    withReservationArray(reservationLogic: ReservationLogic) {
      app.register((app) => reservationsRoutes(app, reservationLogic));
      return appCreator;
    },
    app() {
      return app;
    },
  };

  return appCreator;
};
