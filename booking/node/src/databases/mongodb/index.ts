import { FastifyInstance } from 'fastify';
import { Document as MongoDBDocument } from 'mongodb';
import { Reservation, ReservationLogic, Room } from '../../domain';
import { RoomLogic } from '../../domain/room';

function getCollection<T extends MongoDBDocument>(fastify: FastifyInstance, collectionName: string) {
  const collection = fastify.mongo.db?.collection<T>(collectionName);
  if (collection) return collection;
  throw new Error(`Cannot find collection: ${collectionName}`);
}

export const roomsMongoDB = (fastify: FastifyInstance, collectionName = 'rooms'): RoomLogic => {
  return {
    async add(room) {
      try {
        const result = await getCollection<Room>(fastify, collectionName).findOneAndUpdate(
          { id: room.id },
          { $setOnInsert: room },
          { upsert: true, returnDocument: 'before' }
        );
        // if result is null, then the room was not found and was added
        // otherwise, the room was found and was not added
        return result === null;
      } catch (error) {
        throw new Error(`Error adding room: ${error}`);
      }
    },
    async get(id) {
      try {
        const result = await getCollection<Room>(fastify, collectionName).findOne(
          { id: id },
          { projection: { _id: false } }
        );
        if (!result) return undefined;
        return result;
      } catch (error) {
        throw new Error(`Error getting room: ${error}`);
      }
    },
    async reset() {
      try {
        await getCollection(fastify, collectionName).deleteMany({});
      } catch (error) {
        throw new Error(`Error resetting rooms: ${error}`);
      }
    },
  };
};

export const reservationMongoDB = (
  fastify: FastifyInstance,
  roomService: RoomLogic,
  collectionName = 'reservations'
): ReservationLogic => {
  return {
    async add(reservation, options) {
      const { id, roomId, checkInDate, checkOutDate } = reservation;
      const { username, password } = options ?? {};
      const existingRoom = await roomService.get(roomId, { username, password });
      if (!existingRoom) return { success: false, reason: 'room does not exist' };

      const collection = getCollection<Reservation>(fastify, collectionName);
      const session = fastify.mongo.client.startSession();
      session.startTransaction();

      try {
        const existingReservationById = await collection.findOne({ id }, { session });

        if (existingReservationById) {
          await session.abortTransaction();
          session.endSession();
          return { success: false, reason: 'already exists' };
        }

        const overlappingReservation = await collection.findOne(
          {
            roomId,
            $or: [
              {
                checkInDate: { $lte: checkInDate },
                checkOutDate: { $gt: checkInDate },
              },
              {
                checkInDate: { $lt: checkOutDate },
                checkOutDate: { $gte: checkOutDate },
              },
            ],
          },
          { session }
        );

        if (overlappingReservation) {
          await session.abortTransaction();
          session.endSession();
          return { success: false, reason: 'room already booked in this period' };
        }

        await collection.insertOne(reservation, { session });
        await session.commitTransaction();
        session.endSession();
        return { success: true };
      } catch (error) {
        await session.abortTransaction();
        session.endSession();
        fastify.log.error(`Failed to insert reservation: ${id}`);
        throw error;
      }
    },
    async get(id) {
      const reservation = await getCollection<Reservation>(fastify, collectionName).findOne(
        { id },
        { projection: { _id: false } }
      );
      if (reservation) return reservation;
      return undefined;
    },
    async reset() {
      try {
        await getCollection(fastify, collectionName).deleteMany({});
      } catch (error) {
        throw new Error(`Error resetting rooms: ${error}`);
      }
    },
  };
};
