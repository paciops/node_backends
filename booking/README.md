# How to run

## Docker compose

To run with `docker-compose`:

```bash
docker-compose up
```

will run [docker-compose.yaml](./docker-compose.yaml) with default settings:

- [nginx](./load_balancer/nginx.conf) as load balancer;
- two node.js microservices, one for the rooms and the other one the reservation;
- one MongoDB container as database;

## Single istance

Both room API and reservation API could run as a microservices or together in a single istance. The difference is in the file that you run:

- [index.ts](./node/src/index.ts) contains the code for both routes (`/camere` and `/prenotazioni`) in one istance;
- [index.room.ts](./node/src/index.room.ts) and [index.reservation.ts](./node/src/index.reservation.ts) separate the two routes into different files so the two docker files ([Dockerfile-room](./node/Dockerfile-room) and [Dockerfile-reservation](./node/Dockerfile-reservation)) can run differente code.

To run the single istance

```bash
npm run build   # to transpile ts into js
npm start       # to run transpiled index.ts
```

MongoDB is needed, one way to run it with Docker is

```bash
docker run --rm --name mongo -p 27017:27017 mongo --replSet=rs0
```

the parametet `--replSet=rs0` is needed to have replica set (needed for transactions).

After a few seconds another command is needed:

```bash
docker exec mongo mongosh  --eval "rs.initiate()"
```

# Test

Multiple tests are done: some with MongoDB as database, others with an array as in memory database.

To run the tests:

```bash
npm run test
```

to print coverage:

```bash
npm run test:coverage
```
