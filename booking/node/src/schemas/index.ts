export const IdParamsSchema = {
  type: 'object',
  properties: {
    id: { type: 'number' },
  },
  required: ['id'],
};

export const RoomBodySchema = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    beds: { type: 'number' },
  },
  required: ['id', 'beds'],
};

export const ReservationBodySchema = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    roomId: RoomBodySchema.properties.id,
    guestName: { type: 'string' },
    checkInDate: { type: 'string', format: 'date-time' },
    checkOutDate: { type: 'string', format: 'date-time' },
    numberOfGuests: { type: 'number' },
    contactInformation: {
      type: 'object',
      properties: {
        phoneNumber: { type: 'string' },
        email: { type: 'string', format: 'email' },
      },
      required: ['phoneNumber', 'email'],
    },
    specialRequests: { type: 'string' },
  },
  required: [
    'id',
    'roomId',
    'guestName',
    'checkInDate',
    'checkOutDate',
    'numberOfGuests',
    'contactInformation',
    'specialRequests',
  ],
};
