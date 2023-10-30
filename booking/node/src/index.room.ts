import { createApp } from './app';
import { MONGODB_DATABASE, MONGODB_REPLICA_SET, MONGODB_URL } from './contants';

const app = createApp(true)
    .withMongoDB(MONGODB_URL, MONGODB_DATABASE, MONGODB_REPLICA_SET)
    .withMongoDBAuth()
    .withRoomMongoDB()
    .app(),
  port = parseInt(process.env.PORT || '3000', 10),
  host = '0.0.0.0';

app
  .listen({ port, host })
  .then((value) => {
    app.log.info(value);
  })
  .catch((error) => {
    app.log.error(error);
    process.exit(1);
  });
