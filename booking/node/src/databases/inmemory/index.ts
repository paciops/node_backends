import { Reservation, ReservationLogic } from '../../domain';
import { Room, RoomLogic } from '../../domain/room';

export const roomsArray = (array: Room[] = []): RoomLogic => {
  return {
    add(room) {
      const existingRoom = array.find(({ id }) => id === room.id);
      if (existingRoom) return false;
      array.push(room);
      return true;
    },
    get(id) {
      return array.find((room) => room.id === id);
    },
    reset() {
      array = [];
    },
  };
};

export const reservationArray = (array: Reservation[] = [], roomService: RoomLogic): ReservationLogic => {
  return {
    async add(reservation) {
      const existingRoom = await roomService.get(reservation.roomId);
      if (!existingRoom) return { success: false, reason: 'room does not exist' };

      const existingReservation = array.find(({ id }) => id === reservation.id);
      if (existingReservation) return { success: false, reason: 'already exists' };

      const overlappingReservation = array.find(
        ({ roomId, checkInDate, checkOutDate }) =>
          roomId === reservation.roomId &&
          checkInDate < reservation.checkOutDate &&
          checkOutDate > reservation.checkInDate
      );

      if (overlappingReservation) return { success: false, reason: 'room already booked in this period' };

      array.push(reservation);
      return { success: true };
    },
    get(id) {
      return array.find((reservation) => reservation.id === id);
    },
    reset() {
      array = [];
    },
  };
};
