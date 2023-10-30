import { fastifyBasicAuth } from '@fastify/basic-auth';
import { fastifyMongodb } from '@fastify/mongodb';
import { fastify } from 'fastify';
import { authorizationArray, authorizationMongoDB } from './auth';
import { reservationArray, roomsArray } from './databases/inmemory';
import { reservationMongoDB, roomsMongoDB } from './databases/mongodb';
import { Reservation, ReservationLogic, Room, RoomLogic, User } from './domain';
import { reservationsRoutes, roomsRoutes } from './routes';

declare module 'fastify' {
  interface FastifyInstance {
    roomService: RoomLogic;
    reservationService: ReservationLogic;
  }
}

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
    withRoomService(roomLogic: RoomLogic) {
      app.decorate('roomService', roomLogic).register(roomsRoutes);
      return appCreator;
    },
    withRoomArray(rooms: Room[] = []) {
      return appCreator.withRoomService(roomsArray(rooms));
    },
    withRoomMongoDB() {
      return appCreator.withRoomService(roomsMongoDB(app));
    },
    withReservationService(reservationLogic: ReservationLogic) {
      app.decorate('reservationService', reservationLogic).register(reservationsRoutes);
      return appCreator;
    },
    withReservationMongoDB() {
      return appCreator.withReservationService(reservationMongoDB(app));
    },
    withReservationArray(reservations: Reservation[] = []) {
      return appCreator.withReservationService(reservationArray(reservations, app.roomService));
    },
    app() {
      return app;
    },
  };

  return appCreator;
};
