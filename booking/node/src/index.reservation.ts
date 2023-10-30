import { createApp } from './app';
import { MONGODB_DATABASE, MONGODB_REPLICA_SET, MONGODB_URL } from './contants';
import { roomHttpService } from './services/room.service';

const isValidURL = (url: string) => {
  const urlPattern = /^(http|https):\/\/[a-zA-Z0-9\-\.]+(:\d{1,5})?$/;
  return urlPattern.test(url);
};

const port = parseInt(process.env.PORT || '3000', 10),
  host = '0.0.0.0',
  roomAPIEndpoint = process.env.ROOM_API_ENDPOINT;

if (!roomAPIEndpoint) throw new Error('ROOM_API_ENDPOINT enviroment variable must be defined');
if (!isValidURL(roomAPIEndpoint)) throw new Error(`${roomAPIEndpoint} is not a valid endpoint`);

const app = createApp(true)
  .withMongoDB(MONGODB_URL, MONGODB_DATABASE, MONGODB_REPLICA_SET)
  .withMongoDBAuth()
  .withReservationMongoDB(roomHttpService(roomAPIEndpoint))
  .app();

app
  .listen({ port, host })
  .then((value) => {
    app.log.info(value);
  })
  .catch((error) => {
    app.log.error(error);
    process.exit(1);
  });
