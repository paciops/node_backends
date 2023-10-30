export const URLS = {
  ROOMS: 'camere',
  RESERVATIONS: 'prenotazioni',
};

export const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://localhost:27017/';
export const MONGODB_DATABASE = process.env.MONGODB_DATABASE || 'booking';
export const MONGODB_REPLICA_SET = process.env.MONGODB_REPLICA_SET || 'rs0';
