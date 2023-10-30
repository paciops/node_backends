import { Room, Value } from '.';

export interface ContactInformation {
  phoneNumber: string;
  email: string;
}

export interface Reservation {
  id: number;
  roomId: Room['id'];
  guestName: string;
  checkInDate: Date;
  checkOutDate: Date;
  numberOfGuests: number;
  contactInformation: ContactInformation;
  specialRequests: string;
}

export type AddRespose = {
  success: boolean;
  reason?: string;
};

export interface ReservationLogic {
  add(reservation: Reservation, options?: Record<string, string | undefined>): Value<AddRespose>;
  get(id: Reservation['id']): Value<Reservation | undefined>;
  reset(): Value<void>;
}
